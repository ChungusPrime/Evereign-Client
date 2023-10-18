import MapManager from "../classes/map_manager.js";
//import NpcManager from "../game_manager/NpcManager.js";

import Player from "../classes/player.js";
import io from 'socket.io-client';

export default class GameOld extends Phaser.Scene {

  constructor () {
    super("Game");
  }

  init ( data ) {

    this.input.mouse.disableContextMenu();

    this.socket = io( "localhost:8082", {
      query: { "character": data.CharacterID }
    });

    this.input.setDefaultCursor('url(assets/images/ui/cursor.png), pointer');

    // Set up control input listeners
    this.cursors = this.input.keyboard.createCursorKeys();
    this.one = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ONE);
    this.two = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TWO);
    this.three = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.THREE);
    this.four = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.FOUR);
    this.five = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.FIVE);
    this.six = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SIX);
    this.seven = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SEVEN);
    this.eight = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.EIGHT);

    this.otherPlayers = this.physics.add.group();
    //this.areaTransitions = this.physics.add.group();
    //this.npcs = this.physics.add.group();

    this.scene.launch("UI");

    this.GameManager = new GameManager(this);
    //this.NpcManager = new NpcManager(this, this.socket);
  }

  create () {

    const self = this;

    this.socket.on('connected', (players, npcs) => {

      const player = players[self.socket.id];
      self.map = self.GameManager.LoadMap(player.area);

      self.player = new Player(self, player);

      self.enablePhysics();
      self.events.emit('player-data', self.player);

      Object.entries(players).forEach((otherPlayer) => {
        self.createOtherPlayer(otherPlayer);
      });

      //self.NpcManager.setup(npcs);

    });

    // Player Events
    this.socket.on('player-connected', (player) => {
      self.createOtherPlayer(player)
    });

    this.socket.on('disconnected', (socket) => {
      self.otherPlayers.getChildren().find(player => player.socket == socket).destroy();
    });

    this.socket.on('player-moved', (x, y, socket) => {
      self.otherPlayers.getChildren().find(player => player.socket == socket).setPosition(x, y);
    });

    this.socket.on('load-area', (data) => {
      self.socket.disconnect();
      self.scene.start();
    });
  }

  update () {

    if ( this.player.x !== this.player.lastPosition.x || this.player.y !== this.player.lastPosition.y ) {
      this.socket.emit('player-moved', { x: this.player.x, y: this.player.y });
    }

    this.player.lastPosition = { x: this.player.x, y: this.player.y };

    /*if(Phaser.Input.Keyboard.JustDown(this.one)) this.useAbility(1)
    if(Phaser.Input.Keyboard.JustDown(this.two)) this.useAbility(2)
    if(Phaser.Input.Keyboard.JustDown(this.three)) this.useAbility(3)
    if(Phaser.Input.Keyboard.JustDown(this.four)) this.useAbility(4)
    if(Phaser.Input.Keyboard.JustDown(this.five)) this.useAbility(5)
    if(Phaser.Input.Keyboard.JustDown(this.six)) this.useAbility(6)
    if(Phaser.Input.Keyboard.JustDown(this.seven)) this.useAbility(7)
    if(Phaser.Input.Keyboard.JustDown(this.eight)) this.useAbility(8)*/

    this.player.update(this.cursors);
    //this.updateNpcPositions();
  }

  enablePhysics () {
    //this.physics.add.collider(this.player, this.GameManager.impassableLayer);
    //this.physics.add.overlap(this.player, this.areaTransitions, this.changeCurrentArea, null, this);
    //this.physics.add.overlap(this.player, this.npcs, this.NpcManager.enteredNpcProximity, null, this);
  }

  createOtherPlayer ( player ) {
    if ( player.socket == this.socket.id || player.socket == undefined) return;
    const character = this.physics.add.sprite(player.x * 1.5, player.y * 1.5, 'characters2', 0).setScale(3.5);
    character.socket = player.socket;
    character.x = player.x;
    character.y = player.y;
    this.otherPlayers.add(character);
  }

  targetNPC ( id ) {
    //const npc = this.npcs.getChildren().find(n => n.id == id);
    //this.player.target = npc;
    //this.events.emit('click-npc', id);
    //this.NpcManager.printNpcInfo(id);
    //console.log(this.player.target);
  }

  useAbility ( id ) {
    //console.log(id);
    //console.log(this.player.target.id);
    //var dist = Phaser.Math.Distance.BetweenPoints(this.player, this.player.target);
    //if ( dist > 50 ) return;
    //this.socket.emit('character-used-ability', { target: this.player.target.id, ability: id });
  }

  updateNpcPositions () {
    /*this.npcs.getChildren().forEach((npc, i) => {
      if ( npc.target != this.socket.id ) return;
      this.socket.emit('npc-moved', { id: npc.id, x: npc.x, y: npc.y, distance: Phaser.Math.Distance.BetweenPoints(this.player, npc) });
    }, this);*/
  }

  changeCurrentArea(player, transition) {
    //this.physics.world.disable(this.player);
    //this.socket.emit('change-area', { area: transition.area, x: transition.newX, y: transition.newY });
  }

}
