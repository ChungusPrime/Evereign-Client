import Phaser from 'phaser';

import Preload from './js/scenes/preload.js';
import Menu from './js/scenes/menu.js';
import Game from './js/scenes/game.js';
import UI from './js/scenes/ui.js';

const width = window.innerWidth;
const height = window.innerHeight;

console.log(width, height);

const config = {
  type: Phaser.AUTO,
  parent: 'evereign',
  width: 1920,
  height: 1080,
  scene: [
    Preload,
    Menu,
    Game,
    UI
  ],
  physics: {
    default: 'arcade',
    arcade: {
      debug: true,
      gravity: {
        y: 0
      }
    }
  },
  dom: {
    createContainer: true
  },
  pixelArt: true,
  roundPixels: true
};

new Phaser.Game(config);