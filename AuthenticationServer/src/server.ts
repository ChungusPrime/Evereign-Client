import Database from './db';
import express, { Request, Response } from "express";
import http from "http";
import crypto from 'crypto';
import cors from "cors";
import bcrypt from 'bcrypt';
import axios from 'axios';
import fs from 'node:fs';

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
const TodaysDateString: string = new Date().toDateString();

/* Environment Variables */
const ListenPort: string = process.env.PORT;
const DatabaseName: string = process.env.DATABASE;
const ServerName: string = process.env.SERVER;
const DbHost: string = process.env.DB_HOST;
const DbPass: string = process.env.DB_PASS;
const DbUser: string = process.env.DB_USER;
const Environment: string = process.env.ENVIRONMENT;

let Servers: { name: string; address: string; players: number; status: string; }[] = [];

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

export default function Log ( message: string ) {
  let content = `[${new Date().toUTCString()}] ${message}`;
  console.log(content);
  fs.writeFile(`logs/${TodaysDateString}.txt`, `${content}\n`, { flag: 'a+' }, err => {
    if (err) console.error(err);
  });
}

/* Boot up the server */
(async () => {

  try {

    if (!fs.existsSync("logs")) {
      fs.mkdirSync("logs");
      Log(`Debug log folder created`);
    }

    Log(`${ServerName} starting up - ENVIRONMENT: ${Environment} - PORT: ${ListenPort}, SERVER: ${ServerName}, DB: ${DatabaseName} (HOST: ${DbHost}, PASS: ${DbPass}, USER: ${DbUser})`);

    await DB.Connect(DatabaseName, DbHost, DbPass, DbUser);

    await RefreshGameServerData();

    Server.listen(ListenPort, () => {
      Log(`${ServerName} finished start up and is running on Port ${ListenPort}...`);
      setInterval(RefreshGameServerData, 60000);
    });

  } catch ( error ) {

    Log(error);

  }

})();

// Check each game server at regular intervals for player count and online status
async function RefreshGameServerData(): Promise<boolean> {
  Log("Refreshing game server data...");
  try {
    for (const server of Servers) {
      try {
        const response = await axios.post<{ players: number }>(`${server.address}/server_status`);
        server.players = response.data.players;
        server.status = "Online";
      } catch ( error ) {
        Log(`${error} - Could not get status of server ${server.name}`);
        server.players = 0;
        server.status = "Offline";
      }
    }
  } catch ( error ) {
    Log(`${error}`);
  }

  return true;
}

app.post('/status', async ( request: Request, response: Response ) => {
  response.header("Access-Control-Allow-Origin", "*");
  response.json({ success: true });
});

app.post('/refresh_server_list', async ( request: Request, response: Response ) => {
  response.header("Access-Control-Allow-Origin", "*");
  response.json({ success: true, servers: Servers });
});

app.post('/create_account', async ( request: Request, response: Response ) => {

  response.header("Access-Control-Allow-Origin", "*");

  try {

    Log(`Account creation request from ${request.socket.remoteAddress}`);

    const Username: string = request.body.username;
    if ( Username == "" || Username.length < 6 ) {
      Log(`Username error, entered value: ${Username} (length: ${Username.length})`);
      return response.json({ success: false, message: "Username must be at least 6 characters" });
    }

    const Password: string = request.body.password;
    if ( Password == "" || Password.length < 6 ) {
      Log(`Password error, entered value: ${Password} (length: ${Password.length})`);
      return response.json({ success: false, message: "Password must be at least 6 characters" });
    }

    const EmailAdd: string = request.body.email;
    if ( EmailAdd == "" || EmailAdd.length < 6 ) {
      Log(`Email address error, entered value: ${EmailAdd} (length: ${EmailAdd.length})`);
      return response.json({ success: false, message: "Email Address must be at least 6 characters" });
    }
    
    const EncryptedPassword: string = await bcrypt.hash(Password, 10);
    const SQL: string = 'INSERT INTO players VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    const ID: string = crypto.randomUUID({ disableEntropyCache: true});
    const Params = [ ID, Username, EmailAdd, EncryptedPassword, null, 0, new Date(), null, null, null ];
    const [Result] = await DB.Query(SQL, Params);

    if ( Result.affectedRows == 1 ) {
      Log(`New Account creation successful - ID: ${ID}`);
      return response.json({ success: true, message: "Account created succesfully" });
    }

    Log(`New Account creation failed`);
    return response.json({ success: false, message: "Failed to create new account" });

  } catch ( error: any ) {
    Log(`New Account creation failed - ${error}`);
    return response.json({ success: false, message: "Failed to create new account" });
  }

});

app.get('/download', async ( request: Request, response: Response ) => {
  response.header("Access-Control-Allow-Origin", "*");
  return response.download('./dist/build.zip', function(err) {
    if ( err ) {
      console.log(err);
    }
  })
});

app.post('/login', async ( request: Request, response: Response ) => {

  response.header("Access-Control-Allow-Origin", "*");

  try {

    Log(`Login request from ${request.socket.remoteAddress} with username: ${request.body.username} and password: ${request.body.password}`);

    const Username: string = request.body.username;
    if ( Username == "" || Username.length < 6 ) {
      Log(`Username error, entered value: ${Username} (length: ${Username.length})`);
      return response.json({ success: false });
    }
      
    const Password: string = request.body.password;
    if ( Password == "" || Password.length < 6 ) {
      Log(`Password error, entered value: ${Password} (length: ${Password.length})`);
      return response.json({ success: false });
    }

    // Verify username
    const SQL = "SELECT id, username, password, banned FROM players WHERE username = ? LIMIT 1";
    const Params = [Username];
    const [User] = await DB.Query(SQL, Params);
    if ( User.length == 0 ) {
      Log(`Account not foundm looking for username: ${Username}`);
      return response.json({ success: false });
    }

    // Verify password
    const PasswordVerified = await bcrypt.compare(Password, User[0].password);
    if ( !PasswordVerified ) {
      Log(`invalid password entered: username: ${Username} - entered password: ${Password}`);
      return response.json({ success: false });
    }

    // Return account and game data
    Log(`Successful login: ${Username}`);
    response.json({ success: true, message: "Success", userid: User[0].id, username: User[0].username, classes: Classes, factions: Factions, races: Races, servers: Servers });

  } catch (error) {
    Log(`Login error: ${error}`);
    return response.json({ success: false });
  }
  
});

