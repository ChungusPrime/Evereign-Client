import { Worker } from 'worker_threads';
import Database from './db';
import CharacterManager from './CharacterManager';
import express, { Request, Response } from 'express';
import * as http from "http";
import * as socketio from "socket.io";
import cors from "cors";
import { RegionData, RegionDataTick, NpcChangedTarget, NPCMoved, NPCStartMove, NPCStopMove, NPCRespawned, NPCDied, NPCReset, WorkerMessageTypes } from './types/message_types';
import routes from './routes';
import NPC from './NPC';
import Character from './Character';

const app = express().options("*", cors()).use([
  express.urlencoded({ extended: true }),
  express.json(),
  express.static(__dirname)
]);

const Server = http.createServer(app);
const io = new socketio.Server(Server, { cors: { origin: "*", methods: ["GET", "POST"] } });
const ListenPort: string = process.env.PORT as string ?? process.argv[2];
const DatabaseName: string = process.env.DATABASE as string ?? process.argv[3];
const ServerName: string = process.env.SERVER as string ?? process.argv[4];
const DB = new Database(DatabaseName);
const CM = new CharacterManager(DB);
let PlayerCount = 0;

let GameRegions: Record<string, RegionData> = {};

app.use('/', routes(CM));

/** Boot up the server **/
(async () => {
  
  try {
    await DB.Connect();
    console.log("Main thread connected to Database");

    const Regions: Array<string> = [
      "A1", "A2", "A3", "A4",
      "B1", "B2", "B3", "B4",
      "C1", "C2", "C3", "C4",
      "D1", "D2", "D3", "D4"
    ];
  
    for ( const region of Regions ) {
      if ( region !== "D1" ) continue;
      GameRegions[region] = {
        name: region,
        Players: {},
        NPCs: {},
        NPCsSyncData: {},
        PlayersSyncData: {},
        Events: {},
        Nodes: {},
        Land: {},
        worker: await initRegionWorker(region)
      };
    }

    Server.listen(ListenPort, () => {
      console.log(`${ServerName} finished start up and is running on Port ${ListenPort}`);
    });

  } catch (error) {
    console.error("Error starting up...", error);
  }

})();

async function initRegionWorker ( region: string ): Promise<Worker> {
  const worker = new Worker("./GameRegion.js", {
    workerData: { name: region }
  }).on("message", ( message: WorkerMessageTypes ) => {
    workerMessageHandlers[message.type](message);
  }).on('error', (error) => {
    console.error(`Worker error in ${region}:`, error);
  }).on('exit', (code) => {
    console.log(`Worker in ${region} exited with code ${code}`);
  });
  return worker;
}

const workerMessageHandlers: Record<string, ( message: WorkerMessageTypes ) => void> = {
  REGION_DATA_TICK: SyncRegionData,
  NPC_CHANGED_TARGET: EmitNpcChangedTarget,
  NPC_STARTED_MOVING: EmitNpcStartMove,
  NPC_STOPPED_MOVING: EmitNpcStopMove,
  NPC_RESPAWNED: EmitNpcRespawn,
  NPC_DIED: EmitNpcDied,
  NPC_RESET: EmitNpcReset,
};

function SyncRegionData ( message: RegionDataTick ): void {
  let region = GameRegions[message.region];
  region.Players = message.Players;
  region.NPCs = message.NPCs;
  for ( const key in message.NPCs ) {
    region.NPCsSyncData[key] = {
      id: message.NPCs[key].id,
      x: message.NPCs[key].x,
      y: message.NPCs[key].y,
      target: message.NPCs[key].target,
      speed: message.NPCs[key].speed
    };
  }
}

function EmitNpcChangedTarget ( message: NpcChangedTarget ): void {
  io.to(message.region).emit( "NpcChangedTarget", message );
}

function EmitNpcStartMove ( message: NPCStartMove ): void {
  io.to(message.region).emit( "NpcStartMove", message );
}

function EmitNpcReset ( message: NPCReset ): void {
  io.to(message.region).emit( "NpcReset", message);
}

function EmitNpcStopMove ( message: NPCStopMove ): void {
  io.to(message.region).emit( "NpcStopMove", message);
}

function EmitNpcRespawn ( message: NPCRespawned ): void {
  io.to(message.region).emit( "NpcRespawned", message );
}

function EmitNpcDied ( message: NPCDied ): void {
  io.to(message.region).emit( "NpcDied", message );
}

/** Listen for client socket.io connections **/
io.on( "connection", async ( socket: socketio.Socket ) => {

  const CharacterID = socket.handshake.query.CharacterID as string;
  const AccountID = socket.handshake.query.AccountID as string;
  const SocketID = socket.id as string;
  console.log(`connected socketID: ${SocketID} - accountID: ${AccountID} - characterID: ${CharacterID}`);

  if ( !CharacterID || !AccountID ) {
    //socket.disconnect(true);
  }

  let Character = await CM.GetCharacter(CharacterID, AccountID, SocketID);

  GameRegions[Character.area].worker.postMessage({ Action: "ADD_PLAYER", Character: Character });
  PlayerCount++;

  socket.emit("ConnectedToGameServer", {
    Character: Character,
    Players: GameRegions[Character.area].PlayersSyncData,
    NPCs: GameRegions[Character.area].NPCsSyncData
  });
  
  io.to(Character.area).emit("PlayerJoined", Character);
  socket.join(Character.area);

  socket.on("Player-Move", async (Coordinates: { x: number, y: number }) => {
    GameRegions[Character.area].worker.postMessage({ Action: "MOVE_PLAYER", Coordinates: Coordinates, Socket: socket.id });
    io.to(Character.area).emit("PlayerMoved", { socket: socket.id, x: Coordinates.x, y: Coordinates.y });
  });

  socket.on("disconnect", async () => {
    GameRegions[Character.area].worker.postMessage({ Action: "REMOVE_PLAYER", Socket: socket.id });
    //await CM.UpdateCharacter(Character);
    PlayerCount--;
    io.to(Character.area).emit("PlayerLeft", socket.id);
  });

});

app.post("/server_status", async (req: Request, res: Response) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.json({ players: PlayerCount });
});