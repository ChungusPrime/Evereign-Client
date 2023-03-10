export default class Boot extends Phaser.Scene {

  constructor () {
    super("Boot");
  }

  preload () {
    this.loadImages();
    this.loadAudio();
    this.loadTileMap();
    this.loadSpriteSheets();
  }

  loadImages () {
    this.load.image('cursor', 'assets/images/ui/cursor.png');
    this.load.image('panel', 'assets/images/ui/panel.png');
    this.load.image('panel-dark', 'assets/images/ui/panel_blue.png');

    this.load.image('button1', 'assets/images/ui/button_long.png');
    this.load.image('button2', 'assets/images/ui/button_long_pressed.png');
    this.load.image('button3', 'assets/images/ui/button.png');
    this.load.image('button4', 'assets/images/ui/button_pressed.png');

    this.load.image('background', 'assets/level/background-extruded.png');

    this.load.image('admurin1', 'assets/images/Admurin_Tiles.png');
    this.load.image('admurin2', 'assets/images/Admurin_Buildings.png');

    this.load.image('bg', 'assets/images/ui/background_sprite.png');
    this.load.image('characterIcon', 'assets/images/ui/character.png');
    this.load.image('inventoryIcon', 'assets/images/ui/inventory.png');
    this.load.image('abilitiesIcon', 'assets/images/ui/abilities.png');
    this.load.image('professionsIcon', 'assets/images/ui/professions.png');
    this.load.image('questsIcon', 'assets/images/ui/quests.png');
    this.load.image('reputationIcon', 'assets/images/ui/reputation.png');

    this.load.image('head-slot', 'assets/images/ui/head_slot.png');
    this.load.image('chest-slot', 'assets/images/ui/chest_slot.png');
    this.load.image('hands-slot', 'assets/images/ui/hands_slot.png');
    this.load.image('legs-slot', 'assets/images/ui/legs_slot.png');
    this.load.image('feet-slot', 'assets/images/ui/feet_slot.png');
    this.load.image('necklace-slot', 'assets/images/ui/necklace_slot.png');
    this.load.image('ring-slot', 'assets/images/ui/ring_slot.png');
  }

  loadSpriteSheets() {
    this.load.spritesheet('items', 'assets/images/items.png', { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('characters', 'assets/images/characters.png', { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('characters2', 'assets/images/characters2.png', { frameWidth: 16, frameHeight: 16 });
    this.load.spritesheet('weapon', 'assets/images/weapons.png', { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('armour', 'assets/images/armour.png', { frameWidth: 32, frameHeight: 32 });

    this.load.spritesheet('skills_a', 'assets/images/Skills_Final.png', { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('skills_b', 'assets/images/Skill_B.png', { frameWidth: 32, frameHeight: 32 });
  }

  loadAudio () {
    this.load.audio('gold', ['assets/audio/Pickup.wav']);
  }

  loadTileMap () {
    this.load.tilemapTiledJSON('Opalla Port', 'assets/level/port4.json');
    this.load.tilemapTiledJSON('Great Plains', 'assets/level/plains.json');
  }

  create () {
    this.scene.start("Title");
  }

}
