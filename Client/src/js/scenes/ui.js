import Button from "../classes/button.js";
import SmallButton from "../classes/small_button.js";
import Text from "../classes/text.js";
import Tooltip from "../classes/tooltip.js";
import Phaser from 'phaser';

export default class UI extends Phaser.Scene {

  constructor () {
    super("UI");
  }

  init ( data ) {
    this.GameScene = data;
  }

  create () {

    this.position_text = new Text( this, this.scale.width - 305, 1, `X: ${this.GameScene.player.x} - Y: ${this.GameScene.player.y}`, 12 ).setOrigin(1, 0);

    this.minimap = this.add.image(this.scale.width - 1, 1, "E1-Minimap").setDisplaySize(300, 300).setOrigin(1, 0);

    //this.chatwindow = this.add.rectangle(1, this.scale.height - 1, 400, 200, "0x00000", 0.8).setOrigin(0, 1);
    this.chatwindow = this.add.dom(1, this.scale.height - 1).createFromCache('ChatBox').setOrigin(0, 1),

    this.NewChatMessage("Welcome to Evereign!");

    this.tooltip = new Tooltip(this, this.scale.width * 0.8, this.scale.height * 0.8);

    this.GameScene.events.on("ShowTooltip", this.ShowTooltip, this);
    this.GameScene.events.on("HideTooltip", this.HideTooltip, this);

    this.health_bar = this.add.image(1, 0, 'red-bar' ).setDisplaySize(250, 20).setOrigin(0);
    this.resource_bar = this.add.image(1, 20, 'blue-bar' ).setDisplaySize(250, 20).setOrigin(0);
    this.xp_bar = this.add.image(1, 40, 'green-bar' ).setDisplaySize(250, 20).setOrigin(0);
    this.attack_bar = this.add.image(1, 60, 'yellow-bar' ).setDisplaySize(250, 20).setOrigin(0);

    this.character_button = new SmallButton(this, this.scale.width * 0.98, this.scale.height * 0.60, null, null, "character-icon", this.ToggleMenu.bind(this, "Character") );
    this.inventory_button = new SmallButton(this, this.scale.width * 0.98, this.scale.height * 0.66, null, null, "inventory-icon", this.ToggleMenu.bind(this, "Inventory") );
    this.skills_button = new SmallButton(this, this.scale.width * 0.98, this.scale.height * 0.72, null, null, "skills-icon", this.ToggleMenu.bind(this, "Skills") );
    this.abilities_button = new SmallButton(this, this.scale.width * 0.98, this.scale.height * 0.78, null, null, "abilities-icon", this.ToggleMenu.bind(this, "Abilities") );
    this.factions_button = new SmallButton(this, this.scale.width * 0.98, this.scale.height * 0.84, null, null, "factions-icon", this.ToggleMenu.bind(this, "Factions") );
    this.quests_button = new SmallButton(this, this.scale.width * 0.98, this.scale.height * 0.90, null, null, "quests-icon", this.ToggleMenu.bind(this, "Quests") );
    this.social_button = new SmallButton(this, this.scale.width * 0.98, this.scale.height * 0.96, null, null, "social-icon", this.ToggleMenu.bind(this, "Social") );
    //this.pvp_button = this.add.image(this.scale.width * 0.98, this.scale.height * 0.95, 'button3').setDisplaySize(64, 64).setOrigin(0.5);
    //this.crafting_button
  }

  update () {
    this.position_text.setText(`X: ${this.GameScene.player.x} - Y: ${this.GameScene.player.y}`);

    if ( this.GameScene.player.basicAttackCooldown > 0 ) {
      this.attack_bar.setDisplaySize( (this.GameScene.player.basicAttackCooldown / this.GameScene.player.basicAttackCooldownMax) * 100 * 2, 15);
    }
    
  }

  ToggleMenu ( name ) {
    console.log(`Show ${name} panel`);
  }

  ShowTooltip ( data ) {
    console.log("hello", data);
    this.tooltip.Show();
  }

  HideTooltip ( data ) {
    console.log("hiding");
    this.tooltip.Hide();
  }

  NewChatMessage ( text ) {
    const element = document.createElement("p");
    element.innerHTML = text;
    this.chatwindow.getChildByID('chat-box').appendChild(element);
  }

}
