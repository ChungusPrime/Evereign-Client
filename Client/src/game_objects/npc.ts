import Game from '../scenes/game';
import Cursor from '../images/cursorGauntlet_blue.png';
import AttackCursor from '../images/cursorSword_silver.png';
import npc from '../../assets/js/classes/npc';
import OtherPlayer from './other_player';
import Player from './player';

export default class NPC extends Phaser.Physics.Arcade.Sprite {

  scene: Game;

  id: string;
  x: number;
  y: number;
  name: string;
  sprite: string;
  faction: string;
  target: Phaser.Physics.Arcade.Sprite;
  moving: boolean;
  speed: number;

  aggro_radius: Phaser.GameObjects.Arc;
  name_plate: Phaser.GameObjects.Text;
  health_bar: Phaser.GameObjects.Image;
  attack_bar: Phaser.GameObjects.Image;

  constructor ( scene: Game, npc: NPC ) {

    super ( scene, npc.x, npc.y, "characters", npc.sprite );

    this.scene = scene;

    // Synced from server
    this.id = npc.id;
    this.x = npc.x;
    this.y = npc.y;
    this.target = npc.target;

    // Get from local json data
    this.name = "Hellkite Bandit";
    this.speed = npc.speed;
    this.faction = "";

    this.aggro_radius = this.scene.add.circle(this.x, this.y, 50, 0xff0000, 0.1).setStrokeStyle(1, 0xffffff, 1);
    this.name_plate = this.scene.add.text(this.x, this.y - 7, this.name).setOrigin(0.5).setFontSize(6).setFontFamily("Mooli");
    //this.titleText = scene.add.text(this.x, this.y - 40, npc.title, { fontSize: "14px", fill: "#ffffff" }).setOrigin(0.5);
    //this.health_bar = scene.add.image(this.x, this.y - 55, 'red-bar' ).setDisplaySize(this.name_plate.width, 10).setOrigin(0.5);
    //this.attack_bar = scene.add.image(this.x, this.y - 45, 'yellow-bar' ).setDisplaySize(this.name_plate.width, 10).setOrigin(0.5);

    scene.add.existing(this);
    scene.physics.world.enable(this);

    this.setInteractive();

    this.on("pointerover", () => {
      this.scene.events.emit("ShowTooltip", this);
      if ( this.faction != this.scene.Player.faction ) {
        this.scene.input.setDefaultCursor(`url(${AttackCursor}), pointer`);
      }
    });

    this.on("pointerout", () => {
      this.scene.events.emit("HideTooltip", this);
      this.scene.input.setDefaultCursor(`url(${Cursor}), pointer`);
    });

    this.on("pointerdown", ( pointer: Phaser.Input.Pointer ) => {
      if ( pointer.rightButtonDown() && this.faction == this.scene.Player.faction ) {
        console.log("open context menu", this);
      } else if ( pointer.leftButtonDown() && this.faction != this.scene.Player.faction ) {
        this.scene.Player.AttackNPC(this);
      }
    });
  }

  ChangeTarget ( socket: string, x: number, y: number ) {
    this.x = x;
    this.y = y;
    if ( this.scene.OtherPlayers.hasOwnProperty(socket) ) {
      this.target = this.scene.OtherPlayers[socket] as Phaser.Physics.Arcade.Sprite;
    } else {
      this.target = this.scene.Player as Phaser.Physics.Arcade.Sprite;
    }
  }

  Reset ( x: number, y: number ) {
    this.setPosition(x, y);
    this.target = null;
    this.aggro_radius.setPosition(this.x, this.y);
    this.name_plate.setPosition(this.x, this.y - 7);
    this.body.reset(this.x, this.y);
    this.moving = false;
  }

  StartMoving ( x: number, y: number, speed: number ) {
    this.setPosition(x, y);
    this.aggro_radius.setPosition(this.x, this.y);
    this.speed = speed;
    this.name_plate.setPosition(this.x, this.y - 7);
    this.moving = true;
    this.play("gladiator_walk");
  }

  StopMoving ( x: number, y: number ) {
    this.setPosition(x, y);
    this.body.reset(this.x, this.y);
    this.aggro_radius.setPosition(this.x, this.y);
    this.name_plate.setPosition(this.x, this.y - 7);
    this.moving = false;
    this.stop();
  }

  update() {
    if ( this.moving ) {
      this.scene.physics.moveTo(this, this.target.x, this.target.y, this.speed);
      this.aggro_radius.setPosition(this.x, this.y);
      this.name_plate.setPosition(this.x, this.y - 7);
      if ( this.body.velocity.x > 0 ) {
        this.flipX = false;
      } else {
        this.flipX = true;
      }
    }
  }

}
