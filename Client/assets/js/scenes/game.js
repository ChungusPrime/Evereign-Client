import Phaser from 'phaser';
import io from 'socket.io-client';
import MapManager from "../classes/map_manager.js";
import Player from "../classes/player.js";
import NPC from "../classes/npc.js";

// Offline Test Data
import PlayerData from "../../data/player_data.js";
import NpcData from "../../data/npc_data.js";

export default class Game extends Phaser.Scene {

  constructor () {
    super("Game");
  }

  init ( data ) {

    this.connected = false;

    console.log(data);

    this.socket = null;

    if ( data.env == "Online" ) {
      this.socket = io( data.server, { query: { "character": data.character } });
    }

    this.input.mouse.disableContextMenu();
    this.input.setDefaultCursor('url(assets/images/click_cursor.png), pointer');
    this.MapManager = new MapManager(this);

    let self = this;

    this.socket.on('JoinedGameServer', ( Data ) => {

      console.log(Data);

      self.map = self.MapManager.LoadMap(Data.Character.area);

      self.player = new Player(self, Data.Character, self.socket);

      console.log(self.player);
      
      self.npc_group = self.physics.add.group();

      NpcData.forEach((npc) => {
        //var NPC_INSTANCE = new NPC(this, npc);
        //this.npc_group.add(NPC_INSTANCE);
      });
  
      self.npc_group.runChildUpdate = true;
  
      self.physics.add.collider(self.player, self.map.water);
      self.physics.add.collider(self.player, self.map.cliffs);
      self.physics.add.collider(self.player, self.map.walls);

      //this.player = players[self.socket.id];

      //self.player = new Player(self, player);

      //self.enablePhysics();
      //self.events.emit('player-data', self.player);

      /*Object.entries(players).forEach((otherPlayer) => {
        self.createOtherPlayer(otherPlayer);
      });*/

      self.scene.launch("UI", self);

      //self.NpcManager.setup(npcs);

      this.connected = true;

    });

    //this.physics.add.overlap(this.player, this.npcs, this.NpcManager.enteredNpcProximity, null, this);
    //this.physics.add.overlap(this.player, this.areaTransitions, this.changeCurrentArea, null, this);

  }

  create () {

  }

  update () {
    if ( this.connected ) {
      this.player.update();
    }
  }

}
