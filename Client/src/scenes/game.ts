import { Socket, io } from "socket.io-client";
import MapManager from "../game_objects/map_manager";
import Player from "../game_objects/player";
import NPC from "../game_objects/npc";
import OtherPlayer from "../game_objects/other_player";
import Cursor from '../images/click_cursor.png';
import UI from "./ui";

export default class Game extends Phaser.Scene {

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

  init ( Data: { CharacterID: number, Server: string } ) {

    console.log(Data);

    this.Connected = false;

    this.Socket = io( Data.Server, {
      query: { "CharacterID": Data.CharacterID },
      closeOnBeforeunload: true,
      transports: ["websocket", "webtransport"],
      autoConnect: true
    });

    console.log(this.Socket);

    this.input.mouse.disableContextMenu();
    this.input.setDefaultCursor(`url(${Cursor}), pointer`);

    this.MapManager = new MapManager(this);

    this.Socket.on('ConnectedToGameServer', ( Data: { Character: Player, Players: OtherPlayer[], NPCs: NPC[] } ) => {
      console.log(Data);
      this.Map = this.MapManager.LoadMap(Data.Character.area);
      this.Player = new Player(this, Data.Character, this.Socket);
      this.physics.add.collider(this.Player, this.MapManager.Cliffs);
      this.physics.add.collider(this.Player, this.MapManager.Walls);
      this.physics.add.collider(this.Player, this.MapManager.Water);

      // add other players;
      Data.Players.forEach( ( player: OtherPlayer ) => {
        this.OtherPlayers[player.socket] = new OtherPlayer(this, player.x, player.y, "1", player.socket);
      });

      // add npcs;
      // update resource nodes

      this.Connected = true;
      this.scene.launch("UI", this);
      this.UI = this.scene.get('UI') as UI;
      this.cameras.main.setZoom(3);
    });

    this.Socket.on("disconnect", () => {
      console.log("Disconnected from server");
      this.Connected = false;
      this.scene.start("Menu");
    });

    this.Socket.on( 'PLAYER_JOINED', ( Data: { x: number, y: number, socket: string } ) => {
      console.log( Data );
      let newPlayer = new OtherPlayer(this, Data.x, Data.y, "1", Data.socket);
      this.OtherPlayers[Data.socket] = newPlayer;
    });

    this.Socket.on( 'PLAYER_LEFT', ( Data: { socket: string } ) => {
      this.OtherPlayers[Data.socket].destroy();
      delete this.OtherPlayers[Data.socket];
    });

    this.Socket.on( 'PLAYER_MOVED', ( Data: { x: number, y: number, socket: string } ) => {
      console.log( Data );
    });

    this.Socket.on( 'NPC_STARTED_MOVING', ( Data: { angle: number, speed: number, id: number } ) => {
      console.log( Data );
    });

    this.Socket.on( 'NPC_STOPPED_MOVING', ( Data: { x: number, y: number, id: number } ) => {
      console.log( Data );
    });

    this.Socket.on( 'REGION_DATA_TICK', ( Data ) => {
      console.log( Data );
    });

  }

  update ( time: number, delta: number ): void {
    if ( this.Connected ) {
      this.Player.update( time, delta );
    }
  }

}
