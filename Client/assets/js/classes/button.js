export default class Button extends Phaser.GameObjects.Container {
  
  constructor(scene, x, y, key, hoverKey, text, targetCallback) {
    super(scene, x, y);

    this.scene = scene;
    this.x = x;
    this.y = y;
    this.key = key;
    this.hoverKey = hoverKey;
    this.text = text;
    this.targetCallback = targetCallback;

    this.button = scene.add.image(0, 0, "button1").setOrigin(0.5);

    this.button.setInteractive();

    this.button.setScale(1.25);

    this.buttonText = scene.add.text(0, 0, this.text, {
      fontSize: "24px",
      fill: "#fff",
    });

    Phaser.Display.Align.In.Center(this.buttonText, this.button);

    this.add(this.button);

    this.add(this.buttonText);

    this.button.on("pointerdown", () => {
      this.targetCallback();
      this.button.setTexture("button2");
      this.scene.sound.play('click');
      this.button.setTexture("button1");
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
