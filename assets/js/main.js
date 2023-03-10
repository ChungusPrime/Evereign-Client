import "./lib/phaser.min.js";

import Boot from "./scenes/boot.js";
import UI from "./scenes/ui.js";
import Game from "./scenes/game.js";
import Title from "./scenes/title.js";

var config = {
  type: Phaser.AUTO,
  parent: "phaser-game",
  width: 1920,
  height: 1080,
  scene: [
    Boot,
    Game,
    UI,
    Title
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

var game = new Phaser.Game(config);
