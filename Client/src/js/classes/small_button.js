import Phaser from 'phaser';

export default class SmallButton extends Phaser.GameObjects.Container {
  
  constructor ( scene, x, y, key, hoverKey, icon, targetCallback ) {
    super(scene, x, y);

    this.scene = scene;
    this.x = x;
    this.y = y;
    this.key = key;
    this.hoverKey = hoverKey;
    this.targetCallback = targetCallback;

    this.button = scene.add.image(0, 0, "button3").setOrigin(0.5).setInteractive().setScale(1).setDisplaySize(64, 64);
    this.icon = scene.add.image(0, 0, icon).setOrigin(0.5).setDisplaySize(42, 42);

    Phaser.Display.Align.In.Center(this.icon, this.button);

    this.add(this.button);
    this.add(this.icon);

    this.button.on("pointerdown", () => {
      this.targetCallback();
      this.button.setTexture("button4");
      this.scene.sound.play('click');
      this.button.setTexture("button3");
    });

    this.button.on("pointerover", () => {
      this.button.setTintFill("0xffffff");
    });

    this.button.on("pointerout", () => {
      this.button.clearTint();
    });

    scene.add.existing(this);
  }

}
