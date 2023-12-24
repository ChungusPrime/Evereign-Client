import Character from "./Character";
import NPC from "./NPC";
import { parentPort, workerData } from 'node:worker_threads';
import { ArcadePhysics } from 'arcade-physics';
import Quadtree = require('@timohausmann/quadtree-js');
import Database from './db';

// Outgoing
interface RegionDataMessage {
  type: string,
  region: string,
  data: {
    players: Record<string, Character>,
    npcs: Record<string, NPC>;
  }
}

// Incoming Messages From Parent
interface AddPlayerMessage {
  Action: string,
  Character: Character
}

interface RemovePlayerMessage {
  Action: string,
  Socket: string
}

interface MovePlayerMessage {
  Action: string,
  Coordinates: { x: number, y: number },
  Socket: string
}

export default class GameRegion {

  DB: Database;
  Width: number = 4800;
  Height: number = 4800;
  Name: string;
  Worker: Worker;
  NPCs: Record<string, NPC> = {};
  Players: Record<string, Character> = {};
  FPS: number = 15;
  Physics: ArcadePhysics;
  Quadtree: Quadtree;
  Tick: number = 0;

  constructor ( Name: string ) {
    this.Name = Name;
    this.Physics = new ArcadePhysics({ width: this.Width, height: this.Height, gravity: { x: 0, y: 0 } });
    this.Quadtree = new Quadtree({ x: 0, y: 0, width: this.Width, height: this.Height });
    this.Create();
  }

  async Create () {
    this.DB = new Database();
    await this.DB.Connect("evereign");
    let [npcs] = await this.DB.Query("SELECT * FROM data_npcs WHERE area = ?", [this.Name]);
    npcs.forEach( (npc: NPC) => { 
      this.NPCs[npc.id] = new NPC(npc);
      this.NPCs[npc.id].body = this.Physics.add.body(npc.x, npc.y, npc.width, npc.height);
    });
  }

  public Update (): void {
    let time = this.Tick * 1000;
    let delta = 1000 / this.FPS;
    Region.Physics.world.update(time, delta);
    this.Tick++;

    const player = { x: 475, y: 3043, width: 48, height: 48, faction: "Twilight", socket: "3ycfwda63263qgfed" };

    // NPC Move loop
    for ( const key in Region.NPCs ) {
      if ( Region.NPCs[key].target == null ) return;
      let npc = Region.NPCs[key];
      Region.Physics.moveTo(npc.body, player.x, player.y, 5);
      npc.x = npc.body.x;
      npc.y = npc.body.y;
      // calculate angle and distance to target
      //let distance = Math.sqrt((npc.x - player.x) ** 2 + (npc.y - player.y) ** 2);
    }
    //parentPort.postMessage({ type: "REGION_DATA_TICK", region: this.Name, data: { players: this.Players, npcs: this.NPCs } });
  }

  AddPlayer ( message: AddPlayerMessage ) {
    let CharacterInstance = new Character(message.Character);
    this.Players[message.Character.socket] = CharacterInstance;
  }

  MovePlayer ( message: MovePlayerMessage ) {
    const player = this.Players[message.Socket];
    player.x = message.Coordinates.x;
    player.y = message.Coordinates.y;
  }

  RemovePlayer ( message: RemovePlayerMessage ) {
    const socket = message.Socket;
    delete this.Players[socket];
    parentPort.postMessage({ type: "PLAYER_REMOVED", region: this.Name, socket: socket });
  }
 
}

let Region = new GameRegion(workerData.name);

type WorkerMessageTypes = AddPlayerMessage | MovePlayerMessage | RemovePlayerMessage;
parentPort.on( "message", ( message: WorkerMessageTypes ) => {
  switch ( message.Action ) {
    case "ADD_PLAYER": Region.AddPlayer(message as AddPlayerMessage); break;
    case "MOVE_PLAYER": Region.MovePlayer(message as MovePlayerMessage); break;
    case "REMOVE_PLAYER": Region.RemovePlayer(message as RemovePlayerMessage); break;
    default: console.log("Invalid action received");
  }
});

setInterval(() => {
  Region.Update();

  // Quadtree testing
  const player = { x: 483, y: 3048, width: 48, height: 48, faction: "Twilight", socket: "3ycfwda63263qgfed" };
  Region.Quadtree.clear();

  for ( const key in Region.NPCs ) {
    Region.Quadtree.insert(Region.NPCs[key]);
  }

  // Get entities near each player
  Region.Quadtree.retrieve(player).forEach( ( npc: NPC ) => {
    if ( npc.target != null ) return;
    if ( npc.status != "Alive" ) return;
    if ( npc.faction == player.faction ) return;
    const distance = Math.sqrt((npc.x - player.x) ** 2 + (npc.y - player.y) ** 2);
    if ( distance < 20 ) {
      npc.target = player.socket;
      parentPort.postMessage({ type: "PLAYER_AGGRO_ENEMY", region: Region.Name });
    }
  });

}, 1000 / Region.FPS);

function distance () {

}
