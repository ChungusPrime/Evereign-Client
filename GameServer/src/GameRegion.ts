import Character from "./Character";
import NPC from "./NPC";
import { parentPort, workerData } from 'node:worker_threads';
import { ArcadePhysics } from 'arcade-physics';
import Quadtree from '@timohausmann/quadtree-js';
import Database from './db';

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
  NPCs: Record<string, NPC> = {};
  Players: Record<string, Character> = {};
  Events: Record<string, any> = {};
  Nodes: Record<string, any> = {};
  Land: Record<string, any> = {};
  FPS: number = 15;
  Physics: ArcadePhysics;
  Quadtree: Quadtree;
  Tick: number = 0;

  constructor ( Name: string ) {
    this.Name = Name;
    this.Create();
    console.log(`${this.Name} set up`);
  }

  async Create () {
    this.Physics = new ArcadePhysics({ width: this.Width, height: this.Height, gravity: { x: 0, y: 0 } });
    this.Quadtree = new Quadtree({ x: 0, y: 0, width: this.Width, height: this.Height });
    this.DB = new Database("evereign");
    await this.DB.Connect();
    let [npcs] = await this.DB.Query("SELECT * FROM data_npcs WHERE region = ?", [this.Name]);
    npcs.forEach( (npc: NPC) => { 
      this.NPCs[npc.id] = new NPC(npc);
      this.NPCs[npc.id].body = this.Physics.add.body(npc.x, npc.y, npc.width, npc.height);
    });
  }

  AddPlayer ( message: AddPlayerMessage ) {
    console.log(`Region: ${this.Name} adding player ${message.Character.socket}`);
    this.Players[message.Character.socket] = message.Character;
  }

  RemovePlayer ( message: RemovePlayerMessage ) {
    delete this.Players[message.Socket];
    console.log(`Region: ${this.Name} removing player ${message.Socket}`);
    for ( const key in this.NPCs ) {
      if ( this.NPCs[key].target == message.Socket ) {
        this.NPCs[key].target = null;
        this.NPCs[key].moving = false;
        this.NPCs[key].body.reset(this.NPCs[key].body.x, this.NPCs[key].body.y);
        this.NPCs[key].UpdatePosition();
        continue;
      }
    }
  }

  MovePlayer ( message: MovePlayerMessage ) {
    this.Players[message.Socket].x = message.Coordinates.x;
    this.Players[message.Socket].y = message.Coordinates.y;
  }

  public Update (): void {

    let time = this.Tick * 1000;
    let delta = 1000 / this.FPS;
    this.Physics.world.update(time, delta);
    this.Tick++;
    
    // NPC update loop
    for ( const key in this.NPCs ) {

      //if ( this.NPCs[key].id != 24 ) continue;

      let npc = this.NPCs[key];

      // if the npc is dead -> Update respawn timer 
      if ( npc.status == "Dead" ) {
        if ( npc.TryRespawn(delta) ) {
          parentPort.postMessage({ type: "NPC_RESPAWNED", region: this.Name, npc_id: npc.id, npc_x: npc.x, npc_y: npc.y });
          continue;
        }
      }

      // If npcs health is reduced to 0 or less -> kill them
      if ( npc.current_health <= 0 ) {
        npc.Die();
        parentPort.postMessage({ type: "NPC_DIED", region: this.Name, npc_id: npc.id, npc_x: npc.x, npc_y: npc.y });
        continue;
      }

      // In combat with target
      if ( !npc.in_combat ) continue;

      if ( npc.target != null ) {

        const player = this.Players[npc.target];
        const dist = Math.sqrt((npc.x - player.x) ** 2 + (npc.y - player.y) ** 2);

        if ( dist > 18 ) {

          this.Physics.moveTo(npc.body, player.x, player.y, npc.speed);
          npc.UpdatePosition();

          if ( !npc.moving ) {
            npc.moving = true;
            parentPort.postMessage({ type: "NPC_STARTED_MOVING", region: this.Name, npc_id: npc.id, npc_x: npc.x, npc_y: npc.y, npc_speed: npc.speed });
          }

          if (npc.TryReset(delta)) {
            parentPort.postMessage({ type: "NPC_RESET", region: this.Name, npc_id: npc.id, npc_x: npc.x, npc_y: npc.y });
          }

        } else {

          npc.body.reset(npc.body.x, npc.body.y);
          npc.UpdatePosition();
          npc.currentResetTime = 0;

          if ( npc.moving ) {
            npc.moving = false;
            parentPort.postMessage({ type: "NPC_STOPPED_MOVING", region: this.Name, npc_id: npc.id, npc_x: npc.x, npc_y: npc.y });
          }

        }

      } else {
        if (npc.TryReset(delta)) {
          parentPort.postMessage({ type: "NPC_RESET", region: this.Name, npc_id: npc.id, npc_x: npc.x, npc_y: npc.y });
        }
      }

      console.log(`NPC: ${npc.id}, X:${Math.round(npc.x)} Y:${Math.round(npc.y)}) combat: ${npc.in_combat} target: ${npc.target} moving: ${npc.moving} reset: ${Math.round(npc.currentResetTime)}/${npc.maxResetTime}`);

    }

    // Refresh Quadtree
    this.Quadtree.clear();
    for ( const key in this.NPCs ) { this.Quadtree.insert(this.NPCs[key]) }
    
    for ( const key in this.Players ) {
      let player = this.Players[key];
      this.Quadtree.retrieve(player).forEach( ( npc: NPC ) => {
        if ( npc.target != null || npc.status != "Alive" || npc.faction == player.faction ) return;
        if ( Math.sqrt((npc.x - player.x) ** 2 + (npc.y - player.y) ** 2) <= npc.baseAggroRange ) {
          npc.ChangeTarget(player.socket);
          parentPort.postMessage({ type: "NPC_CHANGED_TARGET", region: Region.Name, socket: npc.target, npc_id: npc.id, npc_x: npc.x, npc_y: npc.y });
        }
      });
    }

    // update main thread
    parentPort.postMessage({ type: "REGION_DATA_TICK", region: this.Name, Players: this.Players, NPCs: this.NPCs });
  }

}

type WorkerMessageTypes = AddPlayerMessage | MovePlayerMessage | RemovePlayerMessage;
// Incoming messages from the parent thread
parentPort.on( "message", ( message: WorkerMessageTypes ) => {
  switch ( message.Action ) {
    case "ADD_PLAYER": Region.AddPlayer(message as AddPlayerMessage); break;
    case "MOVE_PLAYER": Region.MovePlayer(message as MovePlayerMessage); break;
    case "REMOVE_PLAYER": Region.RemovePlayer(message as RemovePlayerMessage); break;
    default: console.log("Invalid action received"); break;
  }
});

const Region = new GameRegion(workerData.name);

setInterval(() => {
  Region.Update();
}, 1000 / Region.FPS);
