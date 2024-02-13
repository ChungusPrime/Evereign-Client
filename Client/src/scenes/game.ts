import { Socket, io } from "socket.io-client";
import MapManager from "../game_objects/map_manager";
import Player from "../game_objects/player";
import NPC from "../game_objects/npc";
import OtherPlayer from "../game_objects/other_player";
import Cursor from '../images/cursorGauntlet_blue.png';
import UI from "./ui";

interface ConnectedToGameServer {
  Character: Player;
  Players: OtherPlayer[];
  NPCs: NPC[];
}

interface NpcChangedTarget {
  socket: string;
  npc_id: number;
  npc_x: number;
  npc_y: number;
}

interface NpcMoved {
  npc_id: string;
  x: number;
  y: number;
}

interface NpcStartMove {
  npc_id: string;
  npc_x: number;
  npc_y: number;
  npc_speed: number;
}

interface NpcStopMove {
  npc_id: string;
  npc_x: number;
  npc_y: number;
}

interface NpcRespawned {
  npc_id: string;
  npc_x: number;
  npc_y: number;
}

interface NpcDied {
  npc_id: string;
  npc_x: number;
  npc_y: number;
}

interface NpcReset {
  npc_id: string;
  npc_x: number;
  npc_y: number;
} 

export default class Game extends Phaser.Scene {

  Graphics: Phaser.GameObjects.Graphics;
  Connected: boolean;
  Socket: Socket;
  MapManager: MapManager;
  Map: Phaser.Tilemaps.Tilemap;
  UI: UI;
  Player: Player;
  OtherPlayers: Record<string, OtherPlayer> = {};
  NPCs: Record<string, NPC> = {};

  constructor () {
    super("Game");
  }

  init ( Data: { AccountID: number, CharacterID: number, Server: string } ) {

    this.input.mouse.disableContextMenu();
    this.input.setDefaultCursor(`url(${Cursor}), pointer`);
    this.MapManager = new MapManager(this);
    this.Connected = false;
    this.Graphics = this.add.graphics();
    
    this.Socket = io( Data.Server, {
      query: {
        CharacterID: Data.CharacterID,
        AccountID: Data.AccountID
      },
      closeOnBeforeunload: true,
      transports: ["websocket", "webtransport"],
      autoConnect: false
    });
    
    try {
      this.Socket.connect();
    } catch (error) {
      console.log(error);
      this.scene.start("Menu", { disconnected: true });
    }

    this.Socket.on('ConnectedToGameServer', ( Data: ConnectedToGameServer ) => {

      console.log(Data);

      this.Map = this.MapManager.LoadMap(Data.Character.area);

      this.Map.renderDebug(this.Graphics, {
        tileColor: new Phaser.Display.Color(0, 255, 0, 55),
        collidingTileColor: new Phaser.Display.Color(255, 0, 0, 55),
        faceColor: new Phaser.Display.Color(0, 0, 255, 55),
      });

      console.log(Data.Character);
      this.Player = new Player(this, Data.Character, this.Socket);

      // Set colliders
      this.physics.add.collider(this.Player, this.MapManager.Cliffs);
      this.physics.add.collider(this.Player, this.MapManager.Walls);
      this.physics.add.collider(this.Player, this.MapManager.Water);

      // add other players;
      for ( const key in Data.Players ) {
        let player = Data.Players[key];
        this.OtherPlayers[player.socket] = new OtherPlayer(this, player.x, player.y, "1", player.socket);
      }

      // add other npcs;
      for ( const key in Data.NPCs ) {
        let npc = Data.NPCs[key];
        this.NPCs[npc.id] = new NPC(this, npc);
      }
      console.log(this.NPCs);

      // update resource nodes;

      this.Connected = true;
      this.scene.launch("UI", this);
      this.UI = this.scene.get('UI') as UI;
      this.cameras.main.setZoom(3);
    });

    this.Socket.on('NpcChangedTarget', ( Data: NpcChangedTarget ) => {
      console.log("NpcChangedTarget", Data);
      this.NPCs[Data.npc_id].ChangeTarget(Data.socket, Data.npc_x, Data.npc_y )
    });

    this.Socket.on('NpcStartMove', ( Data: NpcStartMove ) => {
      console.log("NpcStartMove", Data);
      this.NPCs[Data.npc_id].StartMoving(Data.npc_x, Data.npc_y, Data.npc_speed);
    });

    this.Socket.on( 'NpcStopMove', ( Data: NpcStopMove ) => {
      console.log("NpcStopMove", Data);
      this.NPCs[Data.npc_id].StopMoving(Data.npc_x, Data.npc_y);
    });

    this.Socket.on( 'NpcReset', ( Data: NpcReset ) => {
      console.log("NpcReset", Data);
      console.log(this.NPCs);
      this.NPCs[Data.npc_id].Reset(Data.npc_x, Data.npc_y);
    });

    this.Socket.on( 'NpcRespawned', ( Data: NpcRespawned ) => {
      this.NPCs[Data.npc_id].x = Data.npc_x;
      this.NPCs[Data.npc_id].y = Data.npc_y;
    });

    this.Socket.on( 'NpcDied', ( Data: NpcDied ) => {
      this.NPCs[Data.npc_id].x = Data.npc_x;
      this.NPCs[Data.npc_id].y = Data.npc_y;
    });

    this.Socket.on("disconnect", () => {
      console.log("Disconnected from server");
      this.scene.stop("UI");
      this.scene.stop("Game");
      this.scene.start("Menu", { disconnected: true });
    });

  }

  logout () {
    this.Socket.disconnect();
    this.scene.stop("UI");
    this.scene.stop("Game");
    this.scene.start("Menu", { disconnected: true });
  }

  update ( time: number, delta: number ): void {

    if ( this.Connected ) {
      this.Player.update( time, delta );
    }

    for ( const key in this.NPCs ) {
      this.NPCs[key].update();
    }

  }

}
