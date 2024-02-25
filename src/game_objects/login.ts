import axios from "axios";
import Menu from "../scenes/menu";
import ModularButton from "./modular_button";
import Panel from "./panel";

export default class Login extends Panel {

  scene: Menu;
  HTML: Phaser.GameObjects.DOMElement;
  Background: Phaser.GameObjects.Rectangle;
  LoginButton: ModularButton;
  RegisterButton: ModularButton;
  UsernameInput: HTMLInputElement;
  PasswordInput: HTMLInputElement;

  constructor ( scene: Menu ) {

    super( scene, "Login", 0, 0, (scene.scale.width * 0.2) + 5, scene.scale.height * 0.35, true, true );
    this.scene = scene;
    
    // Get the center of the screen and reduce the x and y by half of the width and height to center the container
    this.x = scene.scale.width / 2 - (this.displayWidth / 2);
    this.y = scene.scale.height / 2 - (this.displayHeight / 2);

    // Panel Content
    this.Background = scene.add.rectangle(0, 0, this.displayWidth, this.displayHeight, 0x000000, 1).setOrigin(0).setStrokeStyle(2, 0xffffff, 1).setVisible(false);
    this.HTML = this.scene.add.dom(this.ContentBackground.getTopLeft().x + 5, this.ContentBackground.getTopLeft().y + 5).createFromCache('AuthenticationForm').setOrigin(0);
    this.UsernameInput = document.getElementById('username') as HTMLInputElement;
    this.PasswordInput = document.getElementById('password') as HTMLInputElement;
    this.LoginButton = new ModularButton(scene, 5, this.HTML.displayHeight + 40, this.displayWidth - 10, 50, "Grey", "Login", this.AttemptLogin.bind(this), 0);
    this.RegisterButton = new ModularButton(scene, 5, this.HTML.displayHeight + 95, this.displayWidth - 10, 50, "Grey", "Create Account", this.ShowRegistrationForm.bind(this), 0);
    
    this.add([ this.Background, this.HTML, this.LoginButton, this.RegisterButton ]);
    this.setVisible(false);
    scene.add.existing(this);
  }

  ShowRegistrationForm () {
    this.scene.LoginPanel.setVisible(false);
    this.scene.RegistrationPanel.setVisible(true);
  }

  async AttemptLogin(): Promise<boolean> {

    try {

      this.setVisible(false);
      this.scene.Message.setText("Logging in").setVisible(true);
      this.scene.Spinner.setVisible(true);

      const response = await axios.post<LoginResponse>(`${this.scene.AuthServerAddress}/login`, {
        username: this.UsernameInput.value,
        password: this.PasswordInput.value
      });
  
      if ( response.data.success == true ) {
        // Set player account data
        this.scene.AccountID = response.data.userid;
        this.scene.Username = response.data.username;

        // Set character creation options
        this.scene.Classes = response.data.classes;
        this.scene.Races = response.data.races;
        this.scene.Factions = response.data.factions;
        this.scene.CharacterCreationPanel.setOptions();

        // Set game servers
        this.scene.Servers = response.data.servers;
        this.scene.ServerSelectPanel.UpdateList();
        this.scene.ServerSelectPanel.setVisible(true);

        this.scene.ItemBrowserButton.setVisible(false);
        this.scene.OnlineTestButton.setVisible(false);

        this.scene.Message.setText(response.data.message).setVisible(false);
        this.scene.Spinner.setVisible(false);
        this.setVisible(false);
        return true;
      }

      throw new Error("Login failed");

    } catch ( error ) {
      this.scene.Message.setText("Login failed").setVisible(true);
      this.scene.Spinner.setVisible(false);
      this.setVisible(true);
      return false;
    }
    
  }
  
}
