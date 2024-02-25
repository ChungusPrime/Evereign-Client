import Game from "../scenes/game";

export default class Tree extends Phaser.GameObjects.Image {

  scene: Game;
  x: number;
  y: number;
  type: string;

  constructor ( scene: Game, tree: any ) {

    super( scene, tree.x, tree.y, tree.type );

    this.scene = scene;
    this.x = tree.x;
    this.y = tree.y;
    this.type = tree.type;

    this.setScale(1);

    this.setOrigin(0.5, 1);

    this.setInteractive();

    this.on("pointerover", () => {
      this.setTintFill(0x34a623);
    });

    this.on("pointerout", () => {
      this.clearTint();
    });

    scene.add.existing(this);
  }
}
