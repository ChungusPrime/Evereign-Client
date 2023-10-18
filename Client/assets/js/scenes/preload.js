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
    this.load.html('ChatBox', './assets/html/Chat.html');

    // Static Images
    this.load.image('spinner', './assets/images/spinning-sword.png');
    this.load.image('ground_tiles', './assets/images/Tileset_v1.png');
    this.load.image('building_tiles', './assets/images/Tileset_v3_HouseBlocks.png');
    this.load.image('cursor', './assets/images/click_cursor.png');
    this.load.image('attack_cursor', './assets/images/attack_cursor.png');

    this.load.image('oak', './assets/images/oak_tree.png');

    //this.load.image('panel', './assets/images/panel.png');
    this.load.image('panel', './assets/images/panel_upscale.png');

    this.load.image('button1', './assets/images/longbutton.png');
    this.load.image('button2', './assets/images/longbutton_pressed.png');

    this.load.image('button3', './assets/images/smallbutton.png');
    this.load.image('button4', './assets/images/smallbutton_pressed.png');

    // Bar middle graphics
    this.load.image('red-bar', './assets/images/redbar.png');
    this.load.image('blue-bar', './assets/images/bluebar.png');
    this.load.image('green-bar', './assets/images/greenbar.png');
    this.load.image('yellow-bar', './assets/images/yellowbar.png');

    // Item slot icons
    this.load.image('head-slot', './assets/images/head_slot.png');
    this.load.image('chest-slot', './assets/images/chest_slot.png');
    this.load.image('hands-slot', './assets/images/hands_slot.png');
    this.load.image('legs-slot', './assets/images/legs_slot.png');
    this.load.image('feet-slot', './assets/images/feet_slot.png');
    this.load.image('necklace-slot', './assets/images/necklace_slot.png');
    this.load.image('ring-slot', './assets/images/ring_slot.png');
    this.load.image('menu-background', './assets/images/menu_background_3.jpg');

    // UI Button Icons
    this.load.image('character-icon', './assets/images/character.png');
    this.load.image('inventory-icon', './assets/images/inventory.png');
    this.load.image('skills-icon', './assets/images/skills.png');
    this.load.image('abilities-icon', './assets/images/abilities.png');
    this.load.image('factions-icon', './assets/images/factions.png');
    this.load.image('quests-icon', './assets/images/quests.png');
    this.load.image('social-icon', './assets/images/social.png');

    // Sprite Sheets
    this.load.spritesheet('characters', './assets/images/RoguelikeCharacters.png', { frameWidth: 16, frameHeight: 16 });

    // Tiled Maps and Tilesets
    this.load.tilemapTiledJSON('E1', './assets/maps/E1.json');

    // Minimaps
    this.load.image('E1-Minimap', './assets/maps/E1.png');

    this.load.image('tiles-1', './assets/images/Tileset_v1.png');
    this.load.image('tiles-2', './assets/images/Tileset_v3_HouseBlocks.png');
    this.load.image('tiles-3', './assets/images/Tileset_Indoors_v1.png');

    //this.load.spritesheet('items', 'assets/images/items.png', { frameWidth: 32, frameHeight: 32 });
    //this.load.spritesheet('characters', 'assets/images/RoguelikeCharacters.png', { frameWidth: 32, frameHeight: 32 });
    //this.load.spritesheet('characters2', 'assets/images/RoguelikeCharacters.png', { frameWidth: 16, frameHeight: 16 });
    //this.load.spritesheet('weapon', 'assets/images/weapons.png', { frameWidth: 32, frameHeight: 32 });
    //this.load.spritesheet('armour', 'assets/images/armour.png', { frameWidth: 32, frameHeight: 32 });
    //this.load.spritesheet('skills_a', 'assets/images/Skills_Final.png', { frameWidth: 32, frameHeight: 32 });
    //this.load.spritesheet('skills_b', 'assets/images/Skill_B.png', { frameWidth: 32, frameHeight: 32 });

    // Audio
    this.load.audio('click', ['assets/audio/button_click.mp3']);
    this.load.audio('music1', ['assets/audio/The_Old_Tower_Inn.mp3']);
  }

  create () {
    this.scene.start("Menu");
  }

}
