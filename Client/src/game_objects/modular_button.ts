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
    switch ( style ) {

      case "Grey":
        this.button = scene.add.image(0, 0, "button1");
        this.key = "button1";
        this.hoverKey = "button2";
      break;

      case "Blue":
        this.button = scene.add.image(0, 0, "button1");
        this.key = "button1";
        this.hoverKey = "button2";
      break;

      case "Brown":
        this.button = scene.add.image(0, 0, "button1");
        this.key = "button1";
        this.hoverKey = "button2";
      break;

      case "Beige":
        this.button = scene.add.image(0, 0, "button1");
        this.key = "button1";
        this.hoverKey = "button2";
      break;

      default: 
        this.button = scene.add.image(0, 0, "button1");
        this.key = "button1";
        this.hoverKey = "button2";
    }

    this.button.width = width;
    this.button.height = height;
    this.button.setDisplaySize(width, height);
    this.button.setSize(width, height);

    this.button.setInteractive();

    this.button.setOrigin(0.5);

    if ( origin != 0.5 ) {
      this.button.setOrigin(origin);
    }

    this.buttonText = scene.add.text(0, 0, text, {
      fontSize: "24px",
      fontFamily: 'Mooli'
    });

    Phaser.Display.Align.In.Center(this.buttonText, this.button);

    this.add([
      this.button,
      this.buttonText
    ]);

    this.button.on("pointerdown", () => {
      this.targetCallback();
      this.scene.sound.play('click');
      this.button.setTexture("button1");
    });

    this.button.on("pointerover", () => {
      this.button.setTexture("button2");
    });

    this.button.on("pointerout", () => {
      this.button.setTexture("button1");
    });

    scene.add.existing(this);
  }

}
