import { Worker } from 'worker_threads';
import Database from './db';
import CharacterManager from './CharacterManager';
import * as express from "express";
import * as http from "http";
import * as socketio from "socket.io";
const path = require('path');
const util = require('node:util');
const cors = require("cors");

const app = express().options("*", cors()).use([ 
  express.urlencoded({ extended: true }),
  express.json(),
  express.static(__dirname)
]);

const server = http.createServer(app);
const io = new socketio.Server(server, { cors: { origin: "*", methods: ["GET", "POST"] } });

let ListenPort: string = process.env.PORT as string ?? process.argv[2];
let DatabaseName: string = process.env.DATABASE as string ?? process.argv[3];
let ServerName: string = process.env.SERVER as string ?? process.argv[4];

// Data
let DB = new Database();
let CM = new CharacterManager(DB);

let GameRegions: Record<string, { name: string; players: Record<string, any>; npcs: Record<string, any>; worker: Worker; }> = {};

/**
 * Boot up the server
 */
(async () => {
  try {
    await DB.Connect(DatabaseName);
    await SetupRegions();
    server.listen(ListenPort, () => {
      console.log(`${ServerName} finished start up and is running on Port ${ListenPort}`);
    });
  } catch (error) {
    console.log(error);
  }
})();

/**
 * Set up each region of the game with a worker dedicated to it
 */
async function SetupRegions () {
  const Regions: Array<string> = [
    "A1", "A2", "A3", "A4",
    "B1", "B2", "B3", "B4",
    "C1", "C2", "C3", "C4",
    "D1", "D2", "D3", "D4",
    "E1", "E2", "E3", "E4"
  ];
  
  Regions.forEach( (region: string) => {
    // Only use E1 for now
    if ( region != "E1" ) return;
    GameRegions[region] = { name: region, players: {}, npcs: {}, worker: null };

    let worker = new Worker("./GameRegion.js", {
      workerData: GameRegions[region]
    }).on("message", (message) => {
      ProcessWorkerMessage(message);
    }).on("error", (error) => {
      console.error(error);
    }).on("exit", (code) => {
      console.log(`Worker exited with code ${code}.`);
    });

    GameRegions[region].worker = worker;
  });

  return true;
}

/**
 * Process any incoming messages sent from workers and emit updated data to relevant sockets.
 * @param {object} message - The data to process
 */
const ProcessWorkerMessage = ( message: { type: string, region: string, data: any } ) => {

  // Sync region data
  if ( message.type == "REGION_DATA_TICK" ) {
    GameRegions[message.region].players = message.data.players;
    GameRegions[message.region].npcs = message.data.players;
    //console.log(GameRegions[message.region]);
  }

  if ( message.type == "PLAYER_REMOVED" ) {
    io.to(message.region).emit('PLAYER_REMOVED', {});
  }
}

/**
 * Listen for client socket.io connections
 */
io.on( "connection", async ( socket: socketio.Socket ) => {

  //console.log(`socket ${socket.id} requesting to load character ${socket.handshake.query.CharacterID}`);

  // Get the requested character
  let CharacterID = socket.handshake.query.CharacterID as string;
  let Character = await CM.GetCharacter(CharacterID, socket.id);

  // Add the new character to the region worker
  GameRegions[Character.area].worker.postMessage({ Action: "ADD_PLAYER", Character: Character });

  // Send the character and region data to the requesting client
  socket.emit("ConnectedToGameServer", {
    Character: Character,
    Players: GameRegions[Character.area].players,
    NPCs: GameRegions[Character.area].npcs
  });

  // Send the character to currently connected clients in the same area
  io.to(Character.area).emit("PlayerJoined", Character);

  // Join this socket to the area
  socket.join(Character.area);

  socket.on("Player-Move", async (Coordinates: { x: number, y: number }) => {
    //console.log(Coordinates);
    GameRegions[Character.area].worker.postMessage({ Action: "MOVE_PLAYER", Coordinates: Coordinates, Socket: socket.id });
    io.to(Character.area).emit("PlayerMoved", Coordinates.x, Coordinates.y, socket.id);
  });

  socket.on("disconnect", async () => {
    GameRegions[Character.area].worker.postMessage({ Action: "REMOVE_PLAYER", Character: Character });
    await CM.Update(Character);
    io.to(Character.area).emit("disconnected", socket.id);
    //console.log("player disconnected", socket.id);
  });

});

app.get("/dev/monitor", async (req: any, res: any) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.sendFile(path.join(__dirname, '/monitor.html'));
});

app.post("/dev/monitor/data", async (req: any, res: any) => {
  res.header("Access-Control-Allow-Origin", "*");
  //console.log("get fresh data");
  res.json({ RegionData: {} });
});

app.post("/status", async (req: any, res: any) => {
  //console.log(`Getting character list for account ${req.body.id}`);
  res.header("Access-Control-Allow-Origin", "*");
  const characters = await CM.GetAccountList(req.body.id);
  //console.log(characters);
  res.json({
    characters: characters ?? null,
    success: true
  });
});

app.post("/create_character", async (req: any, res: any) => {
  res.header("Access-Control-Allow-Origin", "*");
  //console.log(req.body);
  const character = CM.CreateCharacter(req.body.Character, req.body.UserID);
  res.json({ success: true, character: character });
});