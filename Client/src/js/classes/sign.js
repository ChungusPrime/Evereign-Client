import Phaser from 'phaser';

export default class Sign extends Phaser.GameObjects.Rectangle {
  
  constructor ( scene, sign ) {

    super(scene, sign.x * 3, sign.y * 3, sign.width * 3, sign.height * 3, 0x34A623, 0.70);

    this.scene = scene;
    this.sign = sign;

    this.setOrigin(0);

    this.setInteractive(/*new Phaser.Geom.Rectangle(sign.x * 3, sign.y * 3, sign.width * 3, sign.height * 3), Phaser.Geom.Rectangle.Contains*/);

    this.on("pointerover", () => {
        console.log(this);
        this.setFillStyle(0x34A623, 1);
    });

    this.on("pointerout", () => {
      this.setFillStyle(0x34A623, 0.70);
  });

    scene.add.existing(this);

  }

}
