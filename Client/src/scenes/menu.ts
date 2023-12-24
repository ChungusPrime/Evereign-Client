import Button from "../game_objects/button";
import Text from "../game_objects/text";
import ServerSelect from "../game_objects/server_select";
import CharacterCreation from "../game_objects/character_creation";
import Login from "../game_objects/login";
import Registration from "../game_objects/registration";
import CharacterList from "../game_objects/character_list";
import Cursor from '../images/click_cursor.png';
import axios from 'axios';

export default class Menu extends Phaser.Scene {

  // Player data
  public CharacterID: number = null;
  public AccountID: number = null;
  public Server: string = null;

  public Message: Phaser.GameObjects.Text;
  public Spinner: Phaser.GameObjects.Image;
  public RetryButton: Button;

  // Panels
  public LoginPanel: Login;
  public RegistrationPanel: Registration;
  public ServerSelectPanel: ServerSelect;
  public CharacterListPanel: CharacterList;
  public CharacterCreationPanel: CharacterCreation;

  // Test buttons
  public OfflineTestButton: Button;
  public OnlineTestButton: Button;

  constructor () {
    super("Menu");
  }

  async create () {

    this.input.mouse.disableContextMenu();

    this.sound.play('music1', { loop: true });

    this.input.setDefaultCursor(`url(${Cursor}), pointer`);
    this.add.image(0, 0, 'menu-background').setDisplaySize(this.scale.width, this.scale.height).setOrigin(0);

    this.Spinner = this.add.image(this.scale.width / 2, this.scale.height * 0.90, 'spinner').setDisplaySize(100, 100).setOrigin(0.5);
    this.Message = this.add.text( this.scale.width / 2, this.scale.height * 0.80, "Connecting to login server", { align: "center", fontSize: 42 }).setOrigin(0.5);
    this.RetryButton = new Button( this, this.scale.width * 0.5, this.scale.height * 0.90, "button1", "button2", "Retry", this.GetAuthServerStatus.bind(this) ).setVisible(false);

    // Panels
    this.LoginPanel = new Login(this, 0, 0);
    this.RegistrationPanel = new Registration(this, 0, 0);
    this.ServerSelectPanel = new ServerSelect(this, 0, 0);
    this.CharacterListPanel = new CharacterList(this, 0, 0);
    this.CharacterCreationPanel = new CharacterCreation(this, 0, 0);

    this.OfflineTestButton = new Button( this, 4, 4, "button1", "button2", "Offline Test", this.StartOfflineGame.bind(this), 0 );
    this.OnlineTestButton = new Button( this, 4, 55, "button1", "button2", "Online Test", this.StartOnlineGame.bind(this), 0 );

    // Check if the authentication server is online
    this.GetAuthServerStatus();
  }

  update ( time: number, delta: number ): void {
    this.Spinner.rotation += 0.01;
  }

  // Check if the authentication server responds
  async GetAuthServerStatus () {
    this.RetryButton.setVisible(false);
    this.Spinner.setVisible(true);
    this.Message.setText("Connecting to login server").setVisible(true);
    try {
      const result = await axios.post<{ message: string }>('http://localhost:8081/status');
      console.log(result);
      if ( result.data.message == "Online" ) {
        this.LoginPanel.visible = true;
        this.Spinner.setVisible(false);
        this.Message.setVisible(false);
      }
    } catch (error) {
      console.log(error);
      this.Message.setText("Login server offline, please try again later");
      this.RetryButton.setVisible(true);
      this.Spinner.setVisible(false);
    }
  }

  // Attempt to connect to the selected game server
  async ConnectToGameServer ( server: string, address: string ) {
    console.log(server, address);
    this.ServerSelectPanel.setVisible(false);
    this.Message.setText(`Connecting to ${server}`).setVisible(true);
    this.Spinner.setVisible(true);

    try {
      const result = await axios.post<{ message: string }>(`${address}/status`, { id: this.AccountID });
      console.log(result);
      this.Message.setText("Connected").setVisible(true);
      this.Spinner.setVisible(false);
      this.ServerSelectPanel.setVisible(false);
      this.CharacterListPanel.setVisible(true);
    } catch (error) {
      console.log(error);
      this.Message.setText("Could not connect to game server").setVisible(true);
      this.Spinner.setVisible(false);
      this.ServerSelectPanel.setVisible(true);
    }
  }

  ShowLoginForm () {
    this.LoginPanel.setVisible(true);
    this.RegistrationPanel.setVisible(false);
  }

  ShowRegistrationForm () {
    this.LoginPanel.setVisible(false);
    this.RegistrationPanel.setVisible(true);
  }

  ShowServerList () {
    this.ServerSelectPanel.setVisible(true);
    this.CharacterListPanel.setVisible(false);
  }

  SelectCharacter ( id: number ) {
    console.log(id);
    this.CharacterID = id;
  }

  JoinWorld () {
    console.log(this.CharacterID);
    if ( this.CharacterID == null ) return;
    this.sound.stopByKey('music1');
    this.scene.start("Game", { CharacterID: this.CharacterID, Server: "localhost:8082" } );
  }

  ShowCreateCharacter () {
    this.CharacterListPanel.setVisible(false);
    this.CharacterCreationPanel.setVisible(true);
  }

  CancelCharacterCreation () {
    this.CharacterListPanel.setVisible(true);
    this.CharacterCreationPanel.setVisible(false);
  }

  Logout () {
    //
  }

  ShowRegistrationPage () {
    this.LoginPanel.setVisible(false);
    this.RegistrationPanel.setVisible(true);
  }

  StartOnlineGame() {
    this.sound.stopByKey('music1');
    this.scene.start( "Game", { CharacterID: 1, Server: "localhost:8082" } );
  }

  StartOfflineGame () {
    this.sound.stopByKey('music1');
    this.scene.start( "Game", { character: 1, server: "localhost:8082" } );
  }

}
