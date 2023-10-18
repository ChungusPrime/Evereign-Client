import Button from "./button.js";
import Text from "./text.js";
import Phaser from 'phaser';

export default class Login extends Phaser.GameObjects.Container {
  
  constructor ( scene, x, y ) {

    super(scene, x, y);

    this.scene = scene;
    this.x = x;
    this.y = y;

    this.setSize(scene.scale.width, scene.scale.height);

    this.add([
      scene.add.image(scene.scale.width * 0.5, scene.scale.height * 0.5, 'panel').setDisplaySize(475, 400).setOrigin(0.5),
      new Text(scene, scene.scale.width / 2, scene.scale.height * 0.15, "Evereign", 96),
      scene.add.dom(scene.scale.width * 0.5, scene.scale.height * 0.425).createFromCache('RegistrationForm'),
      new Button(scene, scene.scale.width * 0.5, scene.scale.height * 0.55, 'button1', 'button2', 'Confirm', scene.AttemptRegistration.bind(scene)),
      new Button(scene, scene.scale.width * 0.5, scene.scale.height * 0.625, 'button1', 'button2', 'Cancel', scene.ShowLoginForm.bind(scene))
    ]);

    this.visible = false;

    scene.add.existing(this);
  }
  
}
