import Game from '../scenes/game';
import { Socket } from 'socket.io-client';
import NPC from './npc';

interface CharacterData {
  x: number;
  y: number;
  name: string;
  class: string;
  subclass: string;
  level: number;
  exp: number;
  health: number;
  speed: number;
  area: string;
  faction: string
}

export default class Player extends Phaser.Physics.Arcade.Sprite {

  scene: Game;
  Socket: Socket;
  area: string;
  health: number;

  // Position
  x: number;
  y: number;
  LastX: number;
  LastY: number;

  // Character Data
  class: any;
  speed: number;
  subclass: any;
  level: any;
  exp: any;
  currentHealth: any;
  maxHealth: any;
  faction: string;

  Inventory: Array<any>;
  Equipment: Array<any>;
  Currency: Array<any>;
  Skills: Array<any>;
  Quickbar: Array<any>;
  Factions: Array<any>;
  Land: Array<any>;
  
  Mainhand: string = null;
  Offhand: string = null

  // Controls
  Cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  W: Phaser.Input.Keyboard.Key;
  A: Phaser.Input.Keyboard.Key;
  S: Phaser.Input.Keyboard.Key;
  D: Phaser.Input.Keyboard.Key;
  One: Phaser.Input.Keyboard.Key;
  Two: Phaser.Input.Keyboard.Key;
  Three: Phaser.Input.Keyboard.Key;
  Four: Phaser.Input.Keyboard.Key;
  Five: Phaser.Input.Keyboard.Key;
  Six: Phaser.Input.Keyboard.Key;
  
  constructor( scene: Game, CharacterData: CharacterData, Socket: Socket ) {

    super( scene, CharacterData.x, CharacterData.y, "characters", 0 );

    this.scene = scene;
    this.Socket = Socket;
    Object.assign(this, CharacterData);
    this.LastX = this.x;
    this.LastY = this.y;
    this.speed = 80;

    scene.add.existing(this);
    scene.physics.world.enable(this);
    
    scene.cameras.main.startFollow(this);
    this.setCollideWorldBounds(true);
    this.Cursors = scene.input.keyboard.createCursorKeys();
    this.One = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ONE);
    this.Two = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TWO);
    this.Three = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.THREE);
    this.Four = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.FOUR);
    this.Five = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.FIVE);
    this.Six = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SIX);
    this.W = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    this.A = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.S = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    this.D = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    return this;
  }

  update ( time: number, delta: number ) {

    if (this.Cursors.left.isDown || this.A.isDown ) {
      this.setVelocityX(-this.speed);
      this.flipX = true;
    } else if ( this.Cursors.right.isDown || this.D.isDown ) {
      this.setVelocityX(this.speed);
      this.flipX = false;
    } else {
      this.setVelocityX(0);
    }

    if ( this.Cursors.up.isDown || this.W.isDown ) {
      this.setVelocityY(-this.speed);
    } else if (this.Cursors.down.isDown || this.S.isDown ) {
      this.setVelocityY(this.speed);
    } else {
      this.setVelocityY(0);
    }

    if ( this.body.velocity.x == 0 && this.body.velocity.y == 0 ) {
      this.stop();
    } else {
      if ( !this.anims.isPlaying ) {
        this.play("gladiator_walk");
      }
    }

    if(Phaser.Input.Keyboard.JustDown(this.One)) this.UseQuickbarSlot(1);
    if(Phaser.Input.Keyboard.JustDown(this.Two)) this.UseQuickbarSlot(2);
    if(Phaser.Input.Keyboard.JustDown(this.Three)) this.UseQuickbarSlot(3);
    if(Phaser.Input.Keyboard.JustDown(this.Four)) this.UseQuickbarSlot(4);
    if(Phaser.Input.Keyboard.JustDown(this.Five)) this.UseQuickbarSlot(5);
    if(Phaser.Input.Keyboard.JustDown(this.Six)) this.UseQuickbarSlot(6);
  
    //if ( this.basicAttackCooldown > 0 ) this.basicAttackCooldown -= 1;
    //if ( this.basicAttackCooldown < 0 ) this.basicAttackCooldown = 0;

    if ( this.x !== this.LastX || this.y !== this.LastY ) {
      this.scene.Socket.emit('Player-Move', { x: this.x, y: this.y });
    }

    this.LastX = this.x;
    this.LastY = this.y;
  }

  UseQuickbarSlot ( index: number ) {
    console.log(`Using ability or item in quickslot index: ${index}`);
    this.scene.cameras.main.shake(100, 0.01);
    //this.cameras.main.fadeIn(500, 0, 0, 0);
    //this.cameras.main.fadeOut(500, 0, 0, 0);
  }

  AttackNPC ( target: NPC ) {
    console.log(target.id);
    this.scene.Socket.emit('Player-Attack-NPC', { npc: target.id });
    if ( this.Mainhand == null ) return console.log("No weapon equipped");
    if ( Phaser.Math.Distance.BetweenPoints(this, target) > 15 ) return console.log("Target is too far away");
  }

}
