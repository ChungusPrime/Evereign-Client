const express = require('express');
const bcrypt = require('bcrypt');
const app = express();
const server = require('http').Server(app);
const cors = require('cors');
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

let Database = require("./db");

// Environment Variables
const ListenPort = parseInt(process.env.PORT);
const DatabaseName = process.env.DATABASE;
const ServerName = process.env.SERVER;

(async () => {

  console.log(`Server: ${ServerName} starting up`);
  Database = new Database();
  await Database.Connect(DatabaseName);

  server.listen(ListenPort, () => {
    console.log(`${ServerName} is running on Port ${ListenPort}`);
  });

})();

app.post('/status', async (req, res) => {
  console.log(`${req.ip} requesting server status`);
  res.header("Access-Control-Allow-Origin", "*");
  res.json({ success: true, message: "Online" });
});

app.post('/create_account', async (req, res) => {

  res.header("Access-Control-Allow-Origin", "*");

  if ( req.body.username == "" ) {
    return res.json({ success: false, message: "Please enter a username" });
  } else if ( req.body.username.length < 5 ) {
    return res.json({ success: false, message: "Username must be at least 5 characters long" });
  } else if ( req.body.email == "" ) {
    return res.json({ success: false, message: "Please enter an email address" });
  } else if ( req.body.email.length < 5 ) {
    return res.json({ success: false, message: "Email address must be at least 5 characters long" });
  } else if ( req.body.password == "" ) {
    return res.json({ success: false, message: "Please enter a password" });
  } else if ( req.body.password.length < 5 ) {
    return res.json({ success: false, message: "Password must be at least 5 characters long" });
  }

  try {
    const EncryptedPassword = await bcrypt.hash(req.body.password, 10);
    const sql = `INSERT INTO players (username, email, password, last_server, banned, created_date, last_login, email_confirmed, email_confirmed_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const params = [ req.body.username, req.body.email, EncryptedPassword, null, 0, new Date(), null, null, null ];
    const result = await db.promise().query(sql, params);
    console.log(result);
    res.json({ success: true, message: "Success" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Failed" });
  }

});

app.post('/login', async (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");

  try {

    // Get User
    const [user] = await db.promise().query(`SELECT id, username, password FROM players WHERE username = ? LIMIT 1`, [ req.body.username ]);
    console.table(user);
    if ( user.length == 0 ) {
      return res.json({message: "Incorrect username or password"});
    }

    // Verify password
    const result = await bcrypt.compare(req.body.password, user[0].password);
    console.table(result);
    if ( !result ) {
      return res.json({message: "Incorrect username or password"});
    }

    // Return account and game data
    const Account = { id: user[0].id, username: user[0].username };
    res.json({ user: Account, classes: Classes, factions: Factions, races: Races, message: "Success" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Failed" });
  }
  
});
