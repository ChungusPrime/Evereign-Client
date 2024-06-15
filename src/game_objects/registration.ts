import axios from "axios";
import Menu from "../scenes/menu";
import ModularButton from "./ModularButton";
import Panel from "./panel";

export default class Registration extends Panel {

  scene: Menu;
  HTML: Phaser.GameObjects.DOMElement;
  Background: Phaser.GameObjects.Rectangle;
  AttemptButton: ModularButton;
  CancelButton: ModularButton;
  UsernameInput: HTMLInputElement;
  PasswordInput: HTMLInputElement;
  EmailInput: HTMLInputElement;
  
  constructor ( scene: Menu ) {

    super( scene, "New Account", 0, 0, (scene.scale.width * 0.2) + 5, scene.scale.height * 0.425, true, true );
    this.scene = scene;

    // Get the center of the screen and reduce the x and y by half of the width and height to center the container
    this.x = scene.scale.width / 2 - (this.displayWidth / 2);
    this.y = scene.scale.height / 2 - (this.displayHeight / 2);

    // Panel content
    this.Background = scene.add.rectangle(0, 0, this.displayWidth, this.displayHeight, 0x000000, 1).setOrigin(0).setStrokeStyle(2, 0xffffff, 1).setVisible(false);
    this.HTML = scene.add.dom(this.ContentBackground.getTopLeft().x + 5, this.ContentBackground.getTopLeft().y + 5).createFromCache('RegistrationForm').setOrigin(0);
    this.UsernameInput = document.getElementById('account_username') as HTMLInputElement;
    this.PasswordInput = document.getElementById('account_password') as HTMLInputElement;
    this.EmailInput = document.getElementById('account_email') as HTMLInputElement;
    this.AttemptButton = new ModularButton(scene, 5, this.HTML.displayHeight + 40, this.displayWidth - 10, 50, "Grey", "Confirm", this.AttemptRegistration.bind(this), 0);
    this.CancelButton = new ModularButton(scene, 5, this.HTML.displayHeight + 95, this.displayWidth - 10, 50, "Grey", "Cancel", this.ShowLoginForm.bind(this), 0);

    this.add([ this.Background, this.HTML, this.AttemptButton, this.CancelButton ]);
    this.setVisible(false);
    scene.add.existing(this);
  }

  ShowLoginForm () {
    this.setVisible(false);
    this.scene.LoginPanel.Container.setVisible(true);
  }

  async AttemptRegistration (): Promise<boolean> {

    try {

      this.setVisible(false);

      this.scene.Message.setText("Attempting create your account").setVisible(true);
      this.scene.Spinner.setVisible(true);

      const result = await axios.post<RegisterResponse>(`${this.scene.DataServerAddress}/create_account`, { 
        username: this.UsernameInput.value,
        password: this.PasswordInput.value,
        email: this.EmailInput.value
      });

      this.scene.Spinner.setVisible(false);
      this.setVisible(true);

      if ( result.data.success == true ) {
        this.scene.Message.setText("Account created, you may now login").setVisible(true);
        return true;
      }

      throw new Error("Could not create account");

    } catch ( error ) {
      this.scene.Message.setText("Could not create account").setVisible(true);
      this.scene.Spinner.setVisible(false);
      this.setVisible(true);
      return false;
    }
    
  }
  
}
