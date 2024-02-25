import UI from "../scenes/ui";

export default class Tooltip extends Phaser.GameObjects.Image {

  scene: UI;
  x: number;
  y: number;

  constructor(scene: UI, x: number, y: number) {
    super(scene, x, y, "panel");
    this.scene = scene;
    this.x = x;
    this.y = y;
    this.setOrigin(0);
    this.setDisplaySize(100, 100);
    this.setVisible(false);
    scene.add.existing(this);
  }

  Show() {
    this.setVisible(true);
  }

  Hide() {
    this.setVisible(false);
  }
}
