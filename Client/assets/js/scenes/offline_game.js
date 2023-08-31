import MapManager from "../classes/map_manager.js";
import OfflinePlayer from "../classes/offline_player.js";
import NPC from "../classes/npc.js";

import Phaser from 'phaser';

export default class OfflineGame extends Phaser.Scene {

  constructor () {
    super("OfflineGame");
  }

  init () {
    this.input.mouse.disableContextMenu();
    this.input.setDefaultCursor('url(assets/images/click_cursor.png), pointer');
    this.MapManager = new MapManager(this);
    this.cursors = this.input.keyboard.createCursorKeys();
    this.one = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ONE);
    this.two = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TWO);
    this.three = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.THREE);
    this.four = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.FOUR);
    this.five = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.FIVE);
  }

  create () {

    //this.cameras.main.shake(250, 0.01);
    //this.cameras.main.fadeIn(500, 0, 0, 0);
    //this.cameras.main.fadeOut(500, 0, 0, 0);

    this.map = this.MapManager.LoadMap("F01");
    this.player = new OfflinePlayer(this);

    console.log(this.map);
    console.log(this.player);

    this.scene.launch("UI", [this.map, this.player]);

    this.player.setInteractive();

    this.player.on('pointerdown', () => {
      console.log(this.player);
    });

    //this.npc_group = this.physics.add.group();

    this.npcs = [
      { name: "Steven Trilobyte", title: "Port Official", class: "Civilian", faction: "Kingdom", max_health: 100, sprite: 4, x: 491, y: 2992 },
    ];

    this.npcs.forEach((npc) => {
      var npc = new NPC(this, npc);
    });

    this.physics.add.collider(this.player, this.map.water);
    //this.physics.add.overlap(this.player, this.areaTransitions, this.changeCurrentArea, null, this);
    //this.physics.add.overlap(this.player, this.npcs, this.NpcManager.enteredNpcProximity, null, this);
  }

  update () {
    this.player.update(this.cursors);
    if(Phaser.Input.Keyboard.JustDown(this.one)) this.useAbility(1);
    if(Phaser.Input.Keyboard.JustDown(this.two)) this.useAbility(2);
    if(Phaser.Input.Keyboard.JustDown(this.three)) this.useAbility(3);
    if(Phaser.Input.Keyboard.JustDown(this.four)) this.useAbility(4);
    if(Phaser.Input.Keyboard.JustDown(this.five)) this.useAbility(5);
  }

  useAbility ( index ) {
    console.log( index );
  }

}
