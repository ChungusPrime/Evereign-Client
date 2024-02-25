import Menu from "../scenes/menu";

export default class Button extends Phaser.GameObjects.Container {
  
  key: string;
  hoverKey: string;
  text: string;
  targetCallback: Function;
  button: Phaser.GameObjects.Image;
  buttonText: Phaser.GameObjects.Text;
  x: number;
  y: number;
  scene : Menu;
  
  constructor ( scene: Menu, x: number, y: number, key: string, hoverKey: string, text: string, targetCallback: Function, origin: number = 0.5) {
    super(scene, x, y);

    this.scene = scene;
    this.x = x;
    this.y = y;
    this.key = "button1";
    this.hoverKey = "button2";
    this.text = text;
    this.targetCallback = targetCallback;

    this.button = scene.add.image(0, 0, "button1").setOrigin(0.5);
    this.button.setInteractive();
    this.button.setScale(1);

    if ( origin != 0.5 ) {
      this.button.setOrigin(origin);
    }

    this.buttonText = scene.add.text(0, 0, this.text, {
      fontSize: "24px",
      fontFamily: 'Mooli'
    });

    Phaser.Display.Align.In.Center(this.buttonText, this.button);

    this.add(this.button);
    this.add(this.buttonText);

    this.button.on("pointerdown", () => {
      this.targetCallback();
      this.scene.sound.play('click');
      this.button.setTexture("button1");
    });

    this.button.on("pointerover", () => {
      this.button.setTexture("button2");
      //this.button.setStrokeStyle(0xffffff, 1);
    });

    this.button.on("pointerout", () => {
      this.button.setTexture("button1");
      //this.button.setStrokeStyle(0xffffff, 0);
    });

    scene.add.existing(this);
  }

}
