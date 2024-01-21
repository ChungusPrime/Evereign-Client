import axios from "axios";
import Menu from "../scenes/menu";
import Button from "./button";
import ButtonMulti from "./modular_button";

export default class Registration extends Phaser.GameObjects.Container {

  scene: Menu;
  HTML: Phaser.GameObjects.DOMElement;
  Background: Phaser.GameObjects.Rectangle;
  OriginMarker: Phaser.GameObjects.Text;

  // Buttons
  AttemptButton: Button;
  CancelButton: Button;

  // HTML Inputs
  UsernameInput: HTMLInputElement;
  PasswordInput: HTMLInputElement;
  EmailInput: HTMLInputElement;
  
  constructor ( scene: Menu, x: number, y: number ) {

    super( scene, 0, 0 );
    
    this.scene = scene;

    this.OriginMarker = this.scene.add.text(0, 0, "X", { align: "center" });

    // Get the center of the screen
    this.x = scene.scale.width / 2;
    this.y = scene.scale.height / 2;

    // Set the width and height of the container
    this.width = (scene.scale.width * 0.25) + 5;
    this.height = scene.scale.height * 0.4;
    this.displayWidth = (scene.scale.width * 0.25) + 5;
    this.displayHeight = scene.scale.height * 0.4;

    // reduce the x and y by half of the width and height to center the container (basically like origin 0.5)
    this.x = this.x - (this.displayWidth / 2);
    this.y = this.y - (this.displayHeight / 2);

    this.Background = scene.add.rectangle(0, 0, this.displayWidth, this.displayHeight, 0x000000, 1).setOrigin(0).setStrokeStyle(2, 0xffffff, 1);
    this.HTML = scene.add.dom(5, 5).createFromCache('RegistrationForm').setOrigin(0);

    this.AttemptButton = new Button(scene, 5, this.HTML.displayHeight + 30, 'button1', 'button2', 'Confirm', this.AttemptRegistration.bind(this), 0);
    this.CancelButton = new Button(scene, this.AttemptButton.button.getRightCenter().x + 10, this.HTML.displayHeight + 30, 'button1', 'button2', 'Cancel', scene.ShowLoginForm.bind(scene), 0);

    this.UsernameInput = document.getElementById('account_username') as HTMLInputElement;
    this.PasswordInput = document.getElementById('account_password') as HTMLInputElement;
    this.EmailInput = document.getElementById('account_email') as HTMLInputElement;

    this.add([ this.Background, this.HTML, this.AttemptButton, this.CancelButton, this.OriginMarker ]);
    this.setVisible(false);
    scene.add.existing(this);
  }

  async AttemptRegistration (): Promise<boolean> {

    try {

      this.setVisible(false);

      this.scene.Message.setText("Attempting create your account").setVisible(true);
      this.scene.Spinner.setVisible(true);

      const result = await axios.post<RegisterResponse>(`${this.scene.AuthServerAddress}/create_account`, { 
        username: this.UsernameInput.value,
        password: this.PasswordInput.value,
        email: this.EmailInput.value
      });

      this.scene.Spinner.setVisible(false);
      this.setVisible(true);

      if ( result.data.success == true ) {
        this.scene.Message.setText("Account created, you may now login").setVisible(true);
        return true;
      } else {
        this.scene.Message.setText(result.data.message).setVisible(true);
        return false;
      }

    } catch ( error ) {
      this.scene.Message.setText("Could not create account").setVisible(true);
      this.scene.Spinner.setVisible(false);
      this.setVisible(true);
      return false;
    }
    
  }
  
}
