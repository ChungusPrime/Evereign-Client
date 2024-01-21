import axios from "axios";
import Menu from "../scenes/menu";
import ModularButton from "./modular_button";

export default class Login extends Phaser.GameObjects.Container {

  scene: Menu;
  HTML: Phaser.GameObjects.DOMElement;
  Background: Phaser.GameObjects.Rectangle;
  OriginMarker: Phaser.GameObjects.Text;
  
  // Buttons
  LoginButton: ModularButton;
  RegisterButton: ModularButton;

  // HTML Inputs
  UsernameInput: HTMLInputElement;
  PasswordInput: HTMLInputElement;

  constructor ( scene: Menu, x: number, y: number ) {

    super( scene, 0, 0 );

    this.scene = scene;
    
    this.OriginMarker = this.scene.add.text(0, 0, "x", { align: "center" }).setOrigin(0, 0);

    this.OriginMarker.setVisible(false);

    // Get the center of the screen
    this.x = scene.scale.width / 2;
    this.y = scene.scale.height / 2;

    // Set the width and height of the container
    this.width = (scene.scale.width * 0.2) + 5;
    this.height = scene.scale.height * 0.325;
    this.displayWidth = (scene.scale.width * 0.2) + 5;
    this.displayHeight = scene.scale.height * 0.325;

    // reduce the x and y by half of the width and height to center the container (basically like origin 0.5)
    this.x = this.x - (this.displayWidth / 2);
    this.y = this.y - (this.displayHeight / 2);

    this.Background = scene.add.rectangle(0, 0, this.displayWidth, this.displayHeight, 0x000000, 0.5).setOrigin(0).setStrokeStyle(2, 0xffffff, 0.5).setVisible(false);
    this.HTML = this.scene.add.dom(5, 10).createFromCache('AuthenticationForm').setOrigin(0);

    this.LoginButton = new ModularButton(scene, 5, this.HTML.displayHeight + 15, (scene.scale.width * 0.2) - 5, 50, "Grey", "Login", this.AttemptLogin.bind(this), 0);
    this.RegisterButton = new ModularButton(scene, 5, this.HTML.displayHeight + 70, (scene.scale.width * 0.2) - 5, 50, "Grey", "Create Account", scene.ShowRegistrationForm.bind(scene), 0);

    this.UsernameInput = document.getElementById('username') as HTMLInputElement;
    this.PasswordInput = document.getElementById('password') as HTMLInputElement;
    
    this.add([ this.Background, this.HTML, this.LoginButton, this.RegisterButton, this.OriginMarker ]);
    this.setVisible(false);
    scene.add.existing(this);
  }

  async AttemptLogin(): Promise<boolean> {

    try {
      this.setVisible(false);
      this.scene.Message.setText("Logging in...").setVisible(true);
      this.scene.Spinner.setVisible(true);
      const response = await axios.post<LoginResponse>(`${this.scene.AuthServerAddress}/login`, {
        username: this.UsernameInput.value,
        password: this.PasswordInput.value
      });
  
      if ( response.data.success == true ) {
        this.scene.AccountID = response.data.userid;
        this.scene.Username = response.data.username;
        this.scene.Classes = response.data.classes;
        this.scene.Races = response.data.races;
        this.scene.Factions = response.data.factions;
        this.scene.Servers = response.data.servers;
        this.scene.CharacterCreationPanel.setOptions();
        this.scene.Message.setText(response.data.message).setVisible(false);
        this.scene.Spinner.setVisible(false);
        this.setVisible(false);
        this.scene.ServerSelectPanel.UpdateList();
        this.scene.ServerSelectPanel.setVisible(true);
        return true;
      }
  
      this.scene.Message.setText("Incorrect username or password").setVisible(true);
      this.scene.Spinner.setVisible(false);
      this.setVisible(true);
      return false;

    } catch ( error ) {

      this.scene.Message.setText("Login failed").setVisible(true);
      this.scene.Spinner.setVisible(false);
      this.setVisible(true);
      return false;

    }


    
  }
  
}
