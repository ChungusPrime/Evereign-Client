import Button from "../game_objects/button";
import ModularButton from "../game_objects/modular_button";
import ServerSelect from "../game_objects/server_select";
import CharacterCreation from "../game_objects/character_creation";
import Login from "../game_objects/login";
import Registration from "../game_objects/registration";
import CharacterList from "../game_objects/character_list";
import Cursor from '../images/cursorGauntlet_blue.png';
import axios from 'axios';


interface AuthServerResponse {
  success: boolean;
  message: string;
}

interface GameServerResponse {
  success: boolean;
  characters: { id: string, name: string, level: string }[];
}

export default class Menu extends Phaser.Scene {

  // Player data
  public CharacterID: number = null;
  public AccountID: number = null;
  public Server: string = null;
  public Username: string = null;

  // Status
  public Message: Phaser.GameObjects.Text;
  public Spinner: Phaser.GameObjects.Image;
  public RetryButton: Button;
  public Disconnected: boolean = false;

  // Panels
  public LoginPanel: Login;
  public RegistrationPanel: Registration;
  public ServerSelectPanel: ServerSelect;
  public CharacterListPanel: CharacterList;
  public CharacterCreationPanel: CharacterCreation;

  // Character Creation Options
  public Classes: { name: string, description: string }[] = [];
  public Factions: { name: string, description: string }[] = [];
  public Races: { name: string, description: string }[] = [];
  public Servers: { name: string, address: string, players: string, status: string }[] = [];

  public AuthServerAddress: string;

  public OnlineTestButton: Button;

  constructor () {
    super("Menu");
    if ( process.env.NODE_ENV == "production" ) 
      this.AuthServerAddress = 'http://66.245.193.154:8081';

    if ( process.env.NODE_ENV == "development" ) 
      this.AuthServerAddress = 'http://localhost:8081';
  }

  init ( data: { disconnected: boolean } ) {
    console.log(data);
    if ( data.disconnected == true ) {
      this.Disconnected = true;
    }
  }

  async create () {

    this.input.mouse.disableContextMenu();
    this.sound.play('music1', { loop: true });
    this.input.setDefaultCursor(`url(${Cursor}), pointer`);
    this.add.image(0, 0, 'menu-background').setDisplaySize(this.scale.width, this.scale.height).setOrigin(0);

    this.Spinner = this.add.image(this.scale.width / 2, this.scale.height * 0.90, 'spinner').setDisplaySize(this.scale.width * 0.05, this.scale.height * 0.05).setOrigin(0.5);
    this.Message = this.add.text( this.scale.width / 2, this.scale.height * 0.80, "Connecting to login server", { align: "center", fontSize: "2vw", fontFamily: 'Mooli' }).setOrigin(0.5);
    this.RetryButton = new Button( this, this.scale.width * 0.5, this.scale.height * 0.90, "button1", "button2", "Retry", this.GetAuthServerStatus.bind(this) ).setVisible(false);
    
    // Panels
    this.LoginPanel = new Login(this, 0, 0);
    this.RegistrationPanel = new Registration(this, 0, 0);
    this.ServerSelectPanel = new ServerSelect(this, 0, 0);
    this.CharacterListPanel = new CharacterList(this, 0, 0);
    this.CharacterCreationPanel = new CharacterCreation(this, 0, 0);

    // Test Buttons
    //this.OnlineTestButton = new Button( this, 4, 55, "button1", "button2", "Online Test", this.StartOnlineGame.bind(this), 0 );

    // Check if the authentication server is online
    await this.GetAuthServerStatus();

  }

  // Check if the authentication server responds
  async GetAuthServerStatus (): Promise<boolean> {
    try {
      this.RetryButton.setVisible(false);
      this.Spinner.setVisible(true);
      this.Message.setText("Connecting to login server").setVisible(true);
      const response = await axios.post<AuthServerResponse>(`${this.AuthServerAddress}/status`);
      if ( response.data.success == true && response.data.message == "Online" ) {
        this.LoginPanel.visible = true;
        this.Spinner.setVisible(false);
        this.Message.setVisible(false);
        return true;
      } else {
        this.Message.setText("Login server offline, please try again later");
        this.RetryButton.setVisible(true);
        this.Spinner.setVisible(false);
        return false;
      }
    } catch (error) {
      this.Message.setText("Login server offline, please try again later");
      this.RetryButton.setVisible(true);
      this.Spinner.setVisible(false);
      return false;
    }
  }

  // Attempt to connect to the selected game server
  async ConnectToGameServer ( server: string, address: string ): Promise<boolean> {
    console.log(server, address);
    this.ServerSelectPanel.setVisible(false);
    this.Message.setText(`Connecting to ${server}`).setVisible(true);
    this.Spinner.setVisible(true);
    const response = await axios.post<GameServerResponse>(`${address}/status`, { id: this.AccountID });
    if ( response.data.success == true ) {
      this.Message.setText("Connected").setVisible(false);
      this.Spinner.setVisible(false);
      this.ServerSelectPanel.setVisible(false);
      this.CharacterListPanel.UpdateList(response.data.characters);
      this.CharacterListPanel.setVisible(true);
      return true;
    }
    this.Message.setText("Could not connect to game server").setVisible(true);
    this.Spinner.setVisible(false);
    this.ServerSelectPanel.setVisible(true);
    return false;
  }

  JoinWorld () {
    if ( this.CharacterID == null || this.AccountID == null || this.Server == null ) return;
    console.log(this.CharacterID, this.AccountID, this.Server);
    this.sound.stopByKey('music1');
    this.scene.start("Game", {
      AccountID: this.AccountID,
      CharacterID: this.CharacterID,
      Server: this.Server
    });
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
    this.scene.stop("Menu");
    this.scene.start( "Game", { AccountID: 6, CharacterID: 1, Server: "localhost:8082" } );
  }

  StartOfflineGame () {
    this.sound.stopByKey('music1');
    this.scene.start( "Game", { AccountID: 6, CharacterID: 1, Server: "localhost:8082" } );
  }

  update ( time: number, delta: number ): void {
    this.Spinner.rotation += 0.01;
  }

}
