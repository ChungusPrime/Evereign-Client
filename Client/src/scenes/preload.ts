import * as Assets from '../manifest';

export default class Preload extends Phaser.Scene {

  constructor() {
    super("Preload");
  }

  preload() {

    // HTML 
    this.load.html("AuthenticationForm", Assets.AuthenticationForm);
    this.load.html("RegistrationForm", Assets.RegistrationForm);
    this.load.html("CharacterNameInput", Assets.CharacterNameInput);
    this.load.html("ChatBox", Assets.ChatWindow);

    // UI
    this.load.image("spinner", Assets.SpinnerIcon);
    this.load.image("menu-background", Assets.MenuBackground);
    this.load.image("panel", Assets.BluePanel);
    this.load.image("button1", Assets.BlueButton);
    this.load.image("button2", Assets.BlueButtonPressed);
    this.load.image("button3", Assets.BlueSquareButton);
    this.load.image("button4", Assets.BlueSquareButtonPressed);

    // Cursors
    this.load.image("cursor", Assets.GreyCursorHand);
    this.load.image("attack_cursor", Assets.SilverCursorSword);

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
    this.load.spritesheet("weapons", Assets.Weapons, { frameWidth: 32, frameHeight: 32 });

    // Tilemaps
    this.load.tilemapTiledJSON("D1", Assets.D1);

    // Minimaps
    this.load.image("D1-Minimap", Assets.D1Minimap);

    // Tilesets
    this.load.image("Admurin_Outdoor", Assets.Admurin_Outdoor);
    this.load.image("Admurin_Outdoor_Recolour", Assets.Admurin_Outdoor_Recolour);
    this.load.image("Admurin_Indoor", Assets.Admurin_Indoor);
    this.load.image("Admurin_HouseBlocks", Assets.Admurin_HouseBlocks);

    this.load.image("RogueAdventure_Village", Assets.RogueAdventure_Village);
    this.load.image("RogueAdventure_Jungle_Extras", Assets.RogueAdventure_Jungle_Extras);
    this.load.image("RogueAdventure_Jungle", Assets.RogueAdventure_Jungle);
    this.load.image("RogueAdventure_Ground_Tiles", Assets.RogueAdventure_Ground_Tiles);
    this.load.image("RogueAdventure_Wasteland_Water", Assets.RogueAdventure_Wasteland_Water);
    this.load.image("RogueAdventure_Interior", Assets.RogueAdventure_Interior);
    this.load.image("RogueAdventure_Graveyard", Assets.RogueAdventure_Graveyard);
    this.load.image("RogueAdventure_tree03_s_01_animation", Assets.RogueAdventure_tree03_s_01_animation);
    this.load.image("RogueAdventure_Water", Assets.RogueAdventure_Water);
    this.load.image("RogueAdventure_Cavern", Assets.RogueAdventure_Cavern);
    this.load.image("RogueAdventure_Crypt", Assets.RogueAdventure_Crypt);
    this.load.image("RogueAdventure_Ruins", Assets.RogueAdventure_Ruins);
    this.load.image("RogueAdventure_Village_Animations", Assets.RogueAdventure_Village_Animations);
    this.load.image("RogueAdventure_Ship", Assets.RogueAdventure_Ship);
    this.load.image("RogueAdventure_Wasteland", Assets.RogueAdventure_Wasteland);

    // Sounds
    this.load.audio("click", [Assets.Click]);
    this.load.audio("music1", [Assets.Music1]);
  }

  create() {

    const animations = [
      { key: 'gladiator_walk', frames: [ 0, 1 ] },
      { key: 'godsworn_walk', frames: [ 6, 7 ] },
      { key: 'operative_walk', frames: [ 8, 9 ] },
      { key: 'arcanist_walk', frames: [ 12, 13 ] },
      { key: 'harbinger_walk', frames: [ 14, 15 ] },
    ];

    animations.forEach(anim => {
      this.anims.create({ 
        key: anim.key, 
        frames: this.anims.generateFrameNumbers('characters', { frames: anim.frames }),
        frameRate: 5,
        repeat: -1
      });
    });

    this.scene.start("Menu", { disconnected: false });
  }

}
