import * as Assets from '../manifest';

export default class Preload extends Phaser.Scene {

  constructor() {
    super("Preload");
  }

  preload() {
    this.add.text(this.scale.width / 0.5, this.scale.height / 0.5, "Loading Assets").setOrigin(0.5);

    // HTML 
    this.load.html("AuthenticationForm", Assets.AuthenticationForm);
    this.load.html("RegistrationForm", Assets.RegistrationForm);
    this.load.html("CharacterNameInput", Assets.CharacterNameInput);
    this.load.html("ChatBox", Assets.ChatWindow);

    // UI
    this.load.image("spinner", Assets.Spinner);
    this.load.image("menu-background", Assets.MenuBackground);
    this.load.image("panel", Assets.Panel);
    this.load.image("button1", Assets.LongButton);
    this.load.image("button2", Assets.LongButtonPressed);
    this.load.image("button3", Assets.SmallButton);
    this.load.image("button4", Assets.SmallButtonPressed);

    // Cursors
    this.load.image("cursor", Assets.Cursor1);
    this.load.image("attack_cursor", Assets.Cursor2);

    // Tree Sprites
    this.load.image("oak", Assets.Oak);
    this.load.image("birch", Assets.Birch);

    // Bars
    this.load.image("red-bar", Assets.RedBar);
    this.load.image("blue-bar", Assets.BlueBar);
    this.load.image("green-bar", Assets.GreenBar);
    this.load.image("yellow-bar", Assets.YellowBar);

    // Icons
    this.load.image("character-icon", Assets.CharacterIcon);
    this.load.image("inventory-icon", Assets.InventoryIcon);
    this.load.image("skills-icon", Assets.SkillsIcon);
    this.load.image("abilities-icon", Assets.AbilitiesIcon);
    this.load.image("factions-icon", Assets.FactionsIcon);
    this.load.image("quests-icon", Assets.QuestsIcon);
    this.load.image("social-icon", Assets.SocialIcon);
    this.load.spritesheet("characters", Assets.CharacterSprites, { frameWidth: 16, frameHeight: 16 });

    // Tilemaps
    this.load.tilemapTiledJSON("E1", Assets.E1);

    // Minimaps
    this.load.image("E1-Minimap", Assets.E1Minimap);

    // Tilesets
    this.load.image("tiles-1", Assets.Tiles1);
    this.load.image("tiles-2", Assets.Tiles2);
    this.load.image("tiles-3", Assets.Tiles3);
    this.load.image("tiles-4", Assets.Tiles4);

    // Sounds
    this.load.audio("click", [Assets.Click]);
    this.load.audio("music1", [Assets.Music1]);
  }

  create() {
    this.scene.start("Menu");
  }

}
