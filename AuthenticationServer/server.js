// Evereign - Authentication Server
// The purpose of the auth server is to provide a central server for player authentication when logging in and creating accounts
const express = require('express');
const bcrypt = require('bcrypt');


const app = express();
const server = require('http').Server(app);
const cors = require('cors');
const db = require('./database');

const ListenPort = parseInt(process.argv[2]);

app.options('*', cors())
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname));

const ServerList = [
  { 'name': "Sentinel", 'address': "http://localhost:8082" },
  { 'name': "Crown", 'address': "http://localhost:8083" },
  { 'name': "Phantom", 'address': "http://localhost:8084" },
  { 'name': "Reaver", 'address': "http://localhost:8085" }
];

const Classes = require('./data/class_data');
const Factions = require('./data/faction_data');
const Races = require('./data/race_data');

server.listen(ListenPort, () => {
  console.log(__dirname);
  console.log(`Authentication Server Online! Awaiting requests on port ${server.address().port}`);
});

app.post('/status', async (req, res) => {
  console.log(`${req.ip} requesting server status`);
  res.header("Access-Control-Allow-Origin", "*");
  res.json({ success: true, message: "Authentication server is online" });
});

app.post('/create_account', async (req, res) => {

  res.header("Access-Control-Allow-Origin", "*");

  if ( req.body.username == "" ) {
    res.json({ success: false, message: "Please enter a username" });
    return;
  } else if ( req.body.username.length < 5 ) {
    res.json({ success: false, message: "Username must be at least 5 characters long" });
    return;
  } else if ( req.body.email == "" ) {
    res.json({ success: false, message: "Please enter an email address" });
    return;
  } else if ( req.body.email.length < 5 ) {
    res.json({ success: false, message: "Email address must be at least 5 characters long" });
    return;
  } else if ( req.body.password == "" ) {
    res.json({ success: false, message: "Please enter a password" });
    return;
  } else if ( req.body.password.length < 5 ) {
    res.json({ success: false, message: "Password must be at least 5 characters long" });
    return;
  }

  const EncryptedPassword = await bcrypt.hash(req.body.password, 10);
  const sql = `INSERT INTO players (username, email, password, last_server, banned, created_date, last_login, email_confirmed, email_confirmed_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  const params = [ req.body.username, req.body.email, EncryptedPassword, null, 0, new Date(), null, null, null ];
  const result = await db.promise().query(sql, params);
  res.json({ success: true, message: "Account created successfully, you may now login" });
});

app.post('/login', async (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");

  // Check if the username matches one in the table
  const [user] = await db.promise().query(`SELECT * FROM players WHERE username = ? LIMIT 1`, [ req.body.username ]);

  if ( user.length == 0 ) return res.json({message: "Username Not Found"});

  // Compare the posted password with the stored, decrypted password
  const result = await bcrypt.compare(req.body.password, user[0].password);
  if ( !result ) return res.json({message: "Incorrect Password"});

  const Account = {
    'id': user[0].id,
    'username': user[0].username
  };

  res.json({
    user: Account,
    servers: ServerList,
    classes: Classes,
    factions: Factions,
    races: Races,
    message: "Success"
  });

});
