import Game from "../scenes/game";
import Menu from "../scenes/menu";

export default class Text extends Phaser.GameObjects.Text {

  scene: Menu;
  x: number;
  y: number;
  text: string;

  constructor( scene: Menu, x: number, y: number, text: string, size = 24, wrap = false ) {

    super(scene, x, y, text, { fontSize: `20px`, fontFamily: "Mooli" });

    this.setInteractive();

    this.on('pointerover', () => {
      this.setTint(0x07c9e3);
    });

    this.on('pointerout', () => {
      this.clearTint();
    })

    this.preFX.addShadow(0, 0, 0.06, 1, 0x000000, 6, 1);
    scene.add.existing(this);
  }

}
