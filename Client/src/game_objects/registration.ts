import axios from "axios";
import Menu from "../scenes/menu";
import Button from "./button";
import Text from "./text";

export default class Registration extends Phaser.GameObjects.Container {

  HTML: Phaser.GameObjects.DOMElement;
  scene: Menu;
  AttemptButton: Button;
  CancelButton: Button;
  UsernameInput: HTMLInputElement;
  PasswordInput: HTMLInputElement;
  EmailInput: HTMLInputElement;
  Background: Phaser.GameObjects.Rectangle;
  
  constructor ( scene: Menu, x: number, y: number ) {
    super(scene, x, y);
    this.scene = scene;
    this.x = x;
    this.y = y;
    this.HTML = scene.add.dom(scene.scale.width * 0.5, scene.scale.height * 0.425).createFromCache('RegistrationForm');
    this.AttemptButton = new Button(scene, scene.scale.width * 0.5, scene.scale.height * 0.55, 'button1', 'button2', 'Confirm', this.AttemptRegistration.bind(this));
    this.CancelButton = new Button(scene, scene.scale.width * 0.5, scene.scale.height * 0.625, 'button1', 'button2', 'Cancel', scene.ShowLoginForm.bind(scene));
    this.UsernameInput = document.getElementById('account_username') as HTMLInputElement;
    this.PasswordInput = document.getElementById('account_password') as HTMLInputElement;
    this.EmailInput = document.getElementById('account_email') as HTMLInputElement;
    this.Background = scene.add.rectangle(scene.scale.width * 0.5, scene.scale.height * 0.5, 475, 400, 0x00000, 0.75).setOrigin(0.5).setStrokeStyle(1, 0xffffff, 1);
    this.add([ this.Background, this.HTML, this.AttemptButton, this.CancelButton ]);
    this.setVisible(false);
    scene.add.existing(this);
  }

  async AttemptRegistration (): Promise<boolean> {

    this.setVisible(false);
    this.scene.Message.setText("Attempting create your account").setVisible(true);
    this.scene.Spinner.setVisible(true);

    const result = await axios.post<{ message: string }>('http://localhost:8081/create_account', { username: this.UsernameInput.value, password: this.PasswordInput.value, email: this.EmailInput.value });

    if ( result.data.message != "Success" ) {
      this.scene.Message.setText("Account could not be created").setVisible(true);
      this.scene.Spinner.setVisible(false);
      this.setVisible(true);
      return false;
    }

    this.setVisible(true);
    this.scene.Message.setText("Account created, you may now login").setVisible(true);
    this.scene.Spinner.setVisible(false);
    return true;
  }
  
}
