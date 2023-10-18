import Phaser from "phaser";

export default class Tree extends Phaser.GameObjects.Image {
  constructor(scene, tree) {
    super(scene, tree.x * 3, tree.y * 3, "oak");

    this.scene = scene;
    this.tree = tree;

    this.setScale(3);

    this.setOrigin(0.5, 1);

    this.setInteractive(/*new Phaser.Geom.Rectangle(sign.x * 3, sign.y * 3, sign.width * 3, sign.height * 3), Phaser.Geom.Rectangle.Contains*/);

    this.on("pointerover", () => {
      console.log(this);
      this.setTintFill(0x34a623);
    });

    this.on("pointerout", () => {
      this.clearTint();
    });

    scene.add.existing(this);
  }
}
