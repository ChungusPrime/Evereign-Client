import Button from "../classes/button.js";
import Text from "../classes/text.js";
import Phaser from 'phaser';

export default class UI extends Phaser.Scene {

  constructor () {
    super("UI");
  }

  init ( data ) {
    this.map = data[0];
    this.player = data[1];
  }

  create () {
    this.position_text = new Text( this, this.scale.width * 0.1, this.scale.height * 0.1, `X: ${this.player.x} - Y: ${this.player.y}`, 36 );

    this.health_bar = this.add.graphics();
    this.health_bar.fillStyle(0x00ff00, 1);
    //this.health_bar.fillRect(this.x - 50, this.y - 60, 100 * (this.health / this.maxHealth), 10);
    this.health_bar.fillRect(this.scale.width * 0.1, this.scale.height * 0.9, 200, 20);

    this.xp_bar = "";
    this.resource_bar = "";
    
    this.character_button = this.add.image(this.scale.width * 0.9, this.scale.height * 0.1, 'button3').setDisplaySize(64, 64).setOrigin(0.5);
    this.inventory_button = this.add.image(this.scale.width * 0.85, this.scale.height * 0.1, 'button3').setDisplaySize(64, 64).setOrigin(0.5);
    this.skills_button = this.add.image(this.scale.width * 0.8, this.scale.height * 0.1, 'button3').setDisplaySize(64, 64).setOrigin(0.5);

    this.character_button.setInteractive();

    this.character_button.on('pointerdown', () => {
      console.log("Character button clicked");
    });

    this.character_button.on('pointerover', () => {
      this.character_button.setTintFill("0xffffff");
    });
  
    this.character_button.on('pointerout', () => {
      this.character_button.clearTint();
    });



  }

  update () {

  }

  ToggleMenu ( name ) {

  }

}
