import Menu from "../scenes/menu";

export default class ModularButton extends Phaser.GameObjects.Container {

  scene: Menu;
  x: number;
  y: number;
  width: number;
  height: number;
  style: string;
  text: string;
  targetCallback: Function;
  origin: number;

  key: string;
  hoverKey: string;
  button: Phaser.GameObjects.Image;
  buttonText: Phaser.GameObjects.Text;

  constructor ( scene: Menu, x: number, y: number, width: number, height: number, style: string, text: string, targetCallback: Function, origin: number = 0.5 ) {

    super( scene, x, y );

    this.scene = scene;
    this.x = x;
    this.y = y;
    this.targetCallback = targetCallback;

    // Set button style: Grey, Blue, Brown, Beige, default to Grey
    this.style = style;

    this.button = scene.add.image(0, 0, "button2");
    this.key = "button2";
    this.hoverKey = "button2";

    this.width = width;
    this.height = height;
    this.setDisplaySize(width, height);
    this.setSize(width, height);

    this.button.width = width;
    this.button.height = height;
    this.button.setDisplaySize(width, height);
    this.button.setSize(width, height);

    this.button.setInteractive();
    this.button.setOrigin(0);

    this.buttonText = scene.add.text(0, 0, text, {
      fontSize: "24px",
      fontFamily: 'Mooli',
      align: "Center",
      wordWrap: {
        useAdvancedWrap: true,
        width: this.button.width
      }
    });

    Phaser.Display.Align.In.Center(this.buttonText, this.button);

    this.add([ this.button, this.buttonText ]);

    this.button.on("pointerdown", () => {
      this.targetCallback();
      this.scene.sound.play('click');
    });

    this.button.on("pointerover", () => {});
    this.button.on("pointerout", () => {});

    scene.add.existing(this);

    return this;
  }

}
