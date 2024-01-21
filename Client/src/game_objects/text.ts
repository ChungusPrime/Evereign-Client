import Game from "../scenes/game";
import Menu from "../scenes/menu";

export default class Text extends Phaser.GameObjects.Text {

  scene: Game | Menu;
  x: number;
  y: number;
  text: string;

  constructor( scene: Game, x: number, y: number, text: string, size = 24, wrap = false ) {
    super(scene, x, y, text, { fontSize: `${size}px`, fontFamily: "Mooli" });
    this.setOrigin(0.5);
    this.preFX.addShadow(0, 0, 0.06, 1, 0x000000, 6, 1);
    scene.add.existing(this);
  }

  setWrapWidth() {

  }

}
