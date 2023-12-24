import axios from "axios";
import Menu from "../scenes/menu";
import Button from "./button";
import Text from "./text";

interface LoginResponse {
  user: { id: number, username: string };
  message: string;
  classes: { name: string, description: string, starting: string }[];
  factions: { name: string, description: string }[];
  races: { name: string, description: string }[];
}

export default class Login extends Phaser.GameObjects.Container {

  HTML: Phaser.GameObjects.DOMElement;
  scene: Menu;
  LoginButton: Button;
  RegisterButton: Button;
  UsernameInput: HTMLInputElement;
  PasswordInput: HTMLInputElement;
  Background: Phaser.GameObjects.Rectangle;
  LoginResponse: LoginResponse;
  OriginMarker: Phaser.GameObjects.Text;

  constructor(scene: Menu, x: number, y: number) {

    super( scene, 0, 0 );
    this.scene = scene;

    this.OriginMarker = this.scene.add.text(0, 0, "X");

    this.x = scene.scale.width / 2;
    this.y = scene.scale.height / 2;

    this.width = 500;
    this.height = 400;
    this.displayWidth = 500;
    this.displayHeight = 400;

    this.x = this.x - (this.displayWidth / 2);
    this.y = this.y - (this.displayHeight / 2);

    this.Background = scene.add.rectangle(0, 0, this.width, this.height, 0x000000, 0.9).setOrigin(0).setStrokeStyle(1, 0xffffff, 1);

    this.HTML = this.scene.add.dom(0, 0).createFromCache('AuthenticationForm').setOrigin(0);

    this.LoginButton = new Button(scene, scene.scale.width * 0.5, scene.scale.height * 0.5, 'button1', 'button2', 'Login', this.AttemptLogin.bind(this));
    this.RegisterButton = new Button(scene, scene.scale.width * 0.5, scene.scale.height * 0.7, 'button1', 'button2', 'Create Account', scene.ShowRegistrationForm.bind(scene));
    this.UsernameInput = document.getElementById('username') as HTMLInputElement;
    this.PasswordInput = document.getElementById('password') as HTMLInputElement;
    
    this.add([ this.Background, this.HTML, this.LoginButton, this.RegisterButton, this.OriginMarker ]);
    this.setVisible(false);
    scene.add.existing(this);
  }

  async AttemptLogin(): Promise<boolean> {
    this.setVisible(false);
    this.scene.Message.setText("Attempting to log in").setVisible(true);
    this.scene.Spinner.setVisible(true);
    
    const result = await axios.post<LoginResponse>('http://localhost:8081/login', { username: this.UsernameInput.value, password: this.PasswordInput.value });
    
    this.LoginResponse = result.data;
    console.log(this.LoginResponse);

    if ( this.LoginResponse.message != "Success" ) {
      this.scene.Message.setText("Incorrect username or password").setVisible(true);
      this.scene.Spinner.setVisible(false);
      this.setVisible(true);
      return false;
    }

    this.scene.AccountID = result.data.user.id;
    this.scene.Message.setText(result.data.message).setVisible(true);
    this.scene.Spinner.setVisible(false);
    this.setVisible(false);
    this.scene.ServerSelectPanel.setVisible(true);
    return true;
  }
  
}
