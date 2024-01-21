import Database from './db';
import express, { Request, Response } from "express";
import http from "http";
import crypto from 'crypto';
import cors from "cors";
import bcrypt from 'bcrypt';
import axios from 'axios';

// Game Data
import Classes from './class_data';
import Races from './race_data';
import Factions from './faction_data';

const app = express().options("*", cors()).use([
  express.urlencoded({ extended: true }),
  express.json(),
  express.static(__dirname)
]);

const Server: http.Server = http.createServer(app);
const DB: Database = new Database();

/* Environment Variables */
const ListenPort: string = process.env.PORT;
const DatabaseName: string = process.env.DATABASE;
const ServerName: string = process.env.SERVER;
const DbHost: string = process.env.DB_HOST;
const DbPass: string = process.env.DB_PASS;
const DbUser: string = process.env.DB_USER;
const Environment: string = process.env.ENVIRONMENT;
console.log(`ENVIRONMENT: ${Environment} - PORT: ${ListenPort}, SERVER: ${ServerName}, DB: ${DatabaseName} (HOST: ${DbHost}, PASS: ${DbPass}, USER: ${DbUser})`);

// Check each game server at regular intervals for player count and online status
interface ServerData {
  name: string;
  address: string;
  players: number;
  status: string;
}

let Servers: ServerData[] = [];

if ( Environment == "local" ) {
  Servers = [
    { name: "Skyhaven", address: "http://localhost:8082", players: 0, status: "" },
    { name: "Opalla", address: "http://localhost:8083", players: 0, status: "" },
    { name: "Xanthir", address: "http://localhost:8084", players: 0, status: "" },
    { name: "Willowshade", address: "http://localhost:8085", players: 0, status: "" }
  ];
} else {
  Servers = [
    { name: "Skyhaven", address: "http://localhost:8082", players: 0, status: "" },
    { name: "Opalla", address: "http://localhost:8083", players: 0, status: "" },
    { name: "Xanthir", address: "http://localhost:8084", players: 0, status: "" },
    { name: "Willowshade", address: "http://localhost:8085", players: 0, status: "" }
  ];
}

/* Boot up the server */
(async () => {
  try {
    await DB.Connect(DatabaseName, DbHost, DbPass, DbUser);
    await RefreshServerData();
    Server.listen(ListenPort, () => {
      console.log(`${ServerName} finished start up and is running on Port ${ListenPort}...`);
      setInterval(RefreshServerData, 60000);
    });
  } catch ( error ) {
    console.log(error);
  }
})();

async function RefreshServerData(): Promise<boolean> {
  console.log("Refreshing game server data...");
  try {
    for (const server of Servers) {
      try {
        const response = await axios.post<{ players: number }>(`${server.address}/server_status`);
        server.players = response.data.players;
        server.status = "Online";
      } catch (error) {
        server.players = 0;
        server.status = "Offline";
      }
    }
  } catch (error) {
    console.error(error);
  }

  //console.table(Servers);
  return true;
}

app.post('/status', async ( request: Request, response: Response ) => {
  response.header("Access-Control-Allow-Origin", "*");
  response.json({ success: true, message: "Online" });
});

app.post('/refresh_server_list', async ( request: Request, response: Response ) => {
  response.header("Access-Control-Allow-Origin", "*");
  response.json({ success: true, servers: Servers });
});

app.post('/create_account', async ( request: Request, response: Response ) => {

  response.header("Access-Control-Allow-Origin", "*");

  try {

    const Username: string = request.body.username;
    const Password: string = request.body.password;
    const EmailAdd: string = request.body.email;
  
    if ( Username == "" || Username.length < 6 ) return response.json({ success: false, message: "Username must be at least 6 characters" });
    if ( Password == "" || Password.length < 6 ) return response.json({ success: false, message: "Password must be at least 6 characters" });
    if ( EmailAdd == "" || EmailAdd.length < 6 ) return response.json({ success: false, message: "Email Address must be at least 6 characters" });
    
    const EncryptedPassword = await bcrypt.hash(Password, 10);
    const SQL: string = 'INSERT INTO players VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    const Params = [ crypto.randomUUID({ disableEntropyCache: true}), Username, EmailAdd, EncryptedPassword, null, 0, new Date(), null, null, null ];
    const Result = await DB.Query(SQL, Params);
    console.table(Result);
    if ( Result.affectedRows == 1 ) {
      response.json({ success: true, message: "Account created succesfully" });
    } else {
      response.json({ success: false, message: "Account could not be created" });
    }

  } catch (error) {
    console.log(`New Account Creation: ${error}`);
    response.json({ success: false, message: "Failed to create account" });
  }

});


app.post('/login', async ( request: Request, response: Response ) => {

  response.header("Access-Control-Allow-Origin", "*");

  try {

    console.log(`Login request from ${request.socket.remoteAddress} with USERNAME: ${request.body.username} and PASSWORD: ${request.body.password})`);

    const Username: string = request.body.username;
    const Password: string = request.body.password;
  
    if ( Username == "" || Username.length < 6 ) return response.json({ success: false, message: "Username must be at least 6 characters" });
    if ( Password == "" || Password.length < 6 ) return response.json({ success: false, message: "Password must be at least 6 characters" });

    // Verify username
    const SQL = "SELECT id, username, password FROM players WHERE username = ? LIMIT 1";
    const Params = [Username];
    const [User] = await DB.Query(SQL, Params);
    if ( User.length == 0 ) return response.json({ success: false, message: "Login Failed" });

    // Verify password
    const PasswordVerified = await bcrypt.compare(Password, User[0].password);
    if ( !PasswordVerified ) return response.json({ success: false, message: "Login Failed" });

    // Create unique session token
    //const SessionToken = crypto.randomUUID({ disableEntropyCache: true});
    //console.log(SessionToken);

    // Return account and game data
    response.json({ success: true, message: "Success", userid: User[0].id, username: User[0].username, classes: Classes, factions: Factions, races: Races, servers: Servers });

  } catch (error) {
    console.log(error);
    response.json({ success: false, message: "Login Failed" });
  }
  
});
