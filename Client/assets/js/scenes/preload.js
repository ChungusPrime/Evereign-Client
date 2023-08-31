export default class Preload extends Phaser.Scene {

  constructor () {
    super("Preload");
  }

  preload () {

    console.log("Precaching Assets");
    console.log("Viewport", this.scale.width, this.scale.height);

    // HTML
    this.load.html('AuthenticationForm', './assets/html/Authentication.html');
    this.load.html('RegistrationForm', './assets/html/Registration.html');
    this.load.html('CharacterNameInput', './assets/html/CharacterNameInput.html');

    // Static Images
    this.load.image('spinner', './assets/images/spinning-sword.png');
    this.load.image('ground_tiles', './assets/images/Tileset_v1.png');
    this.load.image('building_tiles', './assets/images/Tileset_v3_HouseBlocks.png');
    this.load.image('cursor', './assets/images/click_cursor.png');
    this.load.image('attack_cursor', './assets/images/attack_cursor.png');
    this.load.image('panel', './assets/images/panel.png');

    this.load.image('button1', './assets/images/longbutton.png');
    this.load.image('button2', './assets/images/longbutton_pressed.png');

    this.load.image('button3', './assets/images/smallbutton.png');
    this.load.image('button4', './assets/images/smallbutton_pressed.png');

    this.load.image('head-slot', './assets/images/head_slot.png');
    this.load.image('chest-slot', './assets/images/chest_slot.png');
    this.load.image('hands-slot', './assets/images/hands_slot.png');
    this.load.image('legs-slot', './assets/images/legs_slot.png');
    this.load.image('feet-slot', './assets/images/feet_slot.png');
    this.load.image('necklace-slot', './assets/images/necklace_slot.png');
    this.load.image('ring-slot', './assets/images/ring_slot.png');
    this.load.image('menu-background', './assets/images/menu_background_3.jpg');

    // Sprite Sheets
    this.load.spritesheet('characters', './assets/images/RoguelikeCharacters.png', { frameWidth: 16, frameHeight: 16 });

    // Tiled Maps and Tilesets
    this.load.tilemapTiledJSON('F01', './assets/maps/F01.json');

    this.load.image('tiles-1', './assets/images/Tileset_v1.png');
    this.load.image('tiles-2', './assets/images/Tileset_v3_HouseBlocks.png');
    this.load.image('tiles-3', './assets/images/Tileset_Indoors_v1.png');

    //this.load.image('background', 'assets/level/background-extruded.png');
    /*this.load.image('bg', 'assets/images/ui/background_sprite.png');
    this.load.image('characterIcon', 'assets/images/ui/character.png');
    this.load.image('inventoryIcon', 'assets/images/ui/inventory.png');
    this.load.image('abilitiesIcon', 'assets/images/ui/abilities.png');
    this.load.image('professionsIcon', 'assets/images/ui/professions.png');
    this.load.image('questsIcon', 'assets/images/ui/quests.png');
    this.load.image('reputationIcon', 'assets/images/ui/reputation.png');*/

    //this.load.spritesheet('items', 'assets/images/items.png', { frameWidth: 32, frameHeight: 32 });
    //this.load.spritesheet('characters', 'assets/images/RoguelikeCharacters.png', { frameWidth: 32, frameHeight: 32 });
    //this.load.spritesheet('characters2', 'assets/images/RoguelikeCharacters.png', { frameWidth: 16, frameHeight: 16 });
    //this.load.spritesheet('weapon', 'assets/images/weapons.png', { frameWidth: 32, frameHeight: 32 });
    //this.load.spritesheet('armour', 'assets/images/armour.png', { frameWidth: 32, frameHeight: 32 });
    //this.load.spritesheet('skills_a', 'assets/images/Skills_Final.png', { frameWidth: 32, frameHeight: 32 });
    //this.load.spritesheet('skills_b', 'assets/images/Skill_B.png', { frameWidth: 32, frameHeight: 32 });

    //this.load.tilemapTiledJSON('Opalla Port', 'assets/level/port4.json');
    //this.load.tilemapTiledJSON('Great Plains', 'assets/level/plains.json');

    // Audio
    this.load.audio('click', ['assets/audio/button_click.mp3']);
    this.load.audio('music1', ['assets/audio/The_Old_Tower_Inn.mp3']);
  }

  create () {
    this.scene.start("Menu");
  }

}
