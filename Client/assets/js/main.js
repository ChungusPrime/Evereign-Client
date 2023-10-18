import Phaser from 'phaser';

import Preload from './scenes/preload.js';
import Menu from './scenes/menu.js';
import Game from './scenes/game.js';
import UI from './scenes/ui.js';

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