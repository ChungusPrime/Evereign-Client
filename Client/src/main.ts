import './sass/main.scss';
import * as Phaser from 'phaser';

import Preload from './scenes/preload';
import Menu from './scenes/menu';
import Game from './scenes/game';
import UI from './scenes/ui';

new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'evereign',
  width: window.innerWidth,
  height: window.innerHeight,
  scene: [ Preload, Menu, Game, UI ],
  physics: {
    default: 'arcade',
    arcade: {
      debug: true,
      gravity: {
        x: 0,
        y: 0
      }
    }
  },
  dom: {
    createContainer: true
  },
  pixelArt: false,
  roundPixels: false
});