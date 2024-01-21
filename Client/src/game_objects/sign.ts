import Game from "../scenes/game";

export default class Sign extends Phaser.GameObjects.Rectangle {

  scene: Game;
  x: number;
  y: number;
  width: number;
  height: number;

  text: string;
  
  constructor ( scene: Game, sign: any ) {

    super( scene, sign.x, sign.y, sign.width, sign.height, 0x34A623, 0.70 );

    this.scene = scene;

    this.x = sign.x;
    this.y = sign.y;

    this.width = sign.width;
    this.height = sign.height;

    this.setOrigin(0);

    this.setInteractive(/*new Phaser.Geom.Rectangle(sign.x * 3, sign.y * 3, sign.width * 3, sign.height * 3), Phaser.Geom.Rectangle.Contains*/);

    this.on("pointerover", () => {
        this.setFillStyle(0x34A623, 1);
    });

    this.on("pointerout", () => {
      this.setFillStyle(0x34A623, 0.70);
    });

    scene.add.existing(this);

  }

}
