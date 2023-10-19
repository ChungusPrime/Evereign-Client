import AuthenticationForm from '../../html/Authentication.html';
import RegistrationForm from '../../html/Registration.html';
import CharacterNameInput from '../../html/CharacterNameInput.html';
import ChatWindow from '../../html/Chat.html';
import Spinner from '../../images/spinning-sword.png';
import Tiles1 from '../../images/Tileset_v1.png';
import Tiles2 from '../../images/Tileset_v3_HouseBlocks.png';
import Tiles3 from '../../images/Tileset_Indoors_v1.png';
import MenuBackground from '../../images/menu_background_3.jpg';
import Cursor1 from '../../images/click_cursor.png';
import Cursor2 from '../../images/attack_cursor.png';
import OakTree from '../../images/oak_tree.png';
import Panel from '../../images/panel_upscale.png';
import LongButton from '../../images/longbutton.png';
import LongButtonPressed from '../../images/longbutton_pressed.png';
import SmallButton from '../../images/smallbutton.png';
import SmallButtonPressed from '../../images/smallbutton_pressed.png';
import RedBar from '../../images/redbar.png';
import BlueBar from '../../images/bluebar.png';
import GreenBar from '../../images/greenbar.png';
import YellowBar from '../../images/yellowbar.png';
import Click from '../../audio/button_click.mp3';
import Music1 from '../../audio/The_Old_Tower_Inn.mp3';

export default class Preload extends Phaser.Scene {

  constructor () {
    super("Preload");
  }

  preload () {

    console.log("Precaching Assets");
    console.log("Viewport", this.scale.width, this.scale.height);

    // HTML
    this.load.html('AuthenticationForm', AuthenticationForm);
    this.load.html('RegistrationForm', RegistrationForm);
    this.load.html('CharacterNameInput', CharacterNameInput);
    this.load.html('ChatBox', ChatWindow);

    // Static Images
    this.load.image('spinner', Spinner);
    this.load.image('menu-background', MenuBackground);
    this.load.image('cursor', Cursor1);
    this.load.image('attack_cursor', Cursor2);
    this.load.image('oak', OakTree);
    this.load.image('panel', Panel);

    this.load.image('button1', LongButton);
    this.load.image('button2', LongButtonPressed);

    this.load.image('button3', SmallButton);
    this.load.image('button4', SmallButtonPressed);

    // Bar middle graphics
    this.load.image('red-bar', RedBar);
    this.load.image('blue-bar', BlueBar);
    this.load.image('green-bar', GreenBar);
    this.load.image('yellow-bar', YellowBar);

    // Item slot icons
    /*this.load.image('head-slot', './assets/images/head_slot.png');
    this.load.image('chest-slot', './assets/images/chest_slot.png');
    this.load.image('hands-slot', './assets/images/hands_slot.png');
    this.load.image('legs-slot', './assets/images/legs_slot.png');
    this.load.image('feet-slot', './assets/images/feet_slot.png');
    this.load.image('necklace-slot', './assets/images/necklace_slot.png');
    this.load.image('ring-slot', './assets/images/ring_slot.png');*/

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

    this.load.image('tiles-1', Tiles1);
    this.load.image('tiles-2', Tiles2);
    this.load.image('tiles-3', Tiles3);

    //this.load.spritesheet('items', 'assets/images/items.png', { frameWidth: 32, frameHeight: 32 });
    //this.load.spritesheet('characters', 'assets/images/RoguelikeCharacters.png', { frameWidth: 32, frameHeight: 32 });
    //this.load.spritesheet('characters2', 'assets/images/RoguelikeCharacters.png', { frameWidth: 16, frameHeight: 16 });
    //this.load.spritesheet('weapon', 'assets/images/weapons.png', { frameWidth: 32, frameHeight: 32 });
    //this.load.spritesheet('armour', 'assets/images/armour.png', { frameWidth: 32, frameHeight: 32 });
    //this.load.spritesheet('skills_a', 'assets/images/Skills_Final.png', { frameWidth: 32, frameHeight: 32 });
    //this.load.spritesheet('skills_b', 'assets/images/Skill_B.png', { frameWidth: 32, frameHeight: 32 });

    // Audio
    this.load.audio('click', [Click]);
    this.load.audio('music1', [Music1]);
  }

  create () {
    this.scene.start("Menu");
  }

}
