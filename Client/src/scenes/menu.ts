import Button from "../game_objects/button";
import ModularButton from "../game_objects/modular_button";
import ServerSelect from "../game_objects/server_select";
import CharacterCreation from "../game_objects/character_creation";
import Login from "../game_objects/login";
import Registration from "../game_objects/registration";
import CharacterList from "../game_objects/character_list";
import Cursor from '../images/cursorGauntlet_blue.png';
import axios from 'axios';
import Backpack from "../game_objects/backpack";

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
  public CharacterCreationPanel: CharacterCreation;
  public CharacterListPanel: CharacterList;
  public Backpack: Backpack;

  public ActivePanel: Phaser.GameObjects.Container;

  // Character Creation Options
  public Classes: { name: string, description: string }[] = [];
  public Factions: { name: string, description: string }[] = [];
  public Races: { name: string, description: string }[] = [];
  public Servers: { name: string, address: string, players: string, status: string }[] = [];

  public AuthServerAddress: string = 'http://localhost:8081';
  public OnlineTestButton: Button;
  public Background: Phaser.GameObjects.Image;
  public ItemBrowserButton: Button;

  constructor () {
    super("Menu");
  }

  init ( data: { disconnected: boolean } ) {

    console.log(process.env.NODE_ENV);

    if ( data.disconnected == true ) {
      this.Disconnected = true;
    }

    if ( process.env.NODE_ENV == "production" ) {
      this.AuthServerAddress = 'http://66.245.193.154:8081';
    }

  }

  async create () {

    this.input.mouse.disableContextMenu();
    this.sound.play('music1', { loop: true });
    this.input.setDefaultCursor(`url(${Cursor}), pointer`);
    this.Background = this.add.image(0, 0, 'menu-background').setDisplaySize(this.scale.width, this.scale.height).setOrigin(0);

    this.Spinner = this.add.image(this.scale.width / 2, this.scale.height * 0.90, 'spinner').setDisplaySize(this.scale.width * 0.05, this.scale.width * 0.05).setOrigin(0.5);
    this.Message = this.add.text( this.scale.width / 2, this.scale.height * 0.80, "Connecting to login server", { align: "center", fontSize: "2vw", fontFamily: 'Mooli' }).setOrigin(0.5);
    this.RetryButton = new Button( this, this.scale.width * 0.5, this.scale.height * 0.90, "button1", "button2", "Retry", this.GetAuthServerStatus.bind(this) ).setVisible(false);

    // Test Buttons
    this.OnlineTestButton = new Button( this, 4, 4, "button1", "button2", "Online Test", this.func1.bind(this), 0 );
    this.ItemBrowserButton = new Button( this, 4, 54, "button1", "button2", "Item Browser", this.func2.bind(this), 0 );
    
    // Panels
    this.LoginPanel = new Login(this);
    this.RegistrationPanel = new Registration(this, 0, 0);
    this.ServerSelectPanel = new ServerSelect(this, 0, 0);
    this.CharacterCreationPanel = new CharacterCreation(this, 0, 0);
    this.CharacterListPanel = new CharacterList(this, 0, 0);
    this.Backpack = new Backpack(this, 0, 0);

    // Check if the authentication server is online
    await this.GetAuthServerStatus();
  }

  update ( time: number, delta: number ): void {
    this.Spinner.rotation += 0.01;
  }

  func1 () {
    //
  }

  func2 () {
    console.log("Show Item Browser");
    this.LoginPanel.setActive(false).setVisible(false);
    this.RegistrationPanel.setActive(false).setVisible(false);
    this.ServerSelectPanel.setActive(false).setVisible(false);
    this.CharacterCreationPanel.setActive(false).setVisible(false);
    this.CharacterListPanel.setActive(false).setVisible(false);
    this.Backpack.setActive(true).setVisible(true);
    this.Backpack.Panel.show();
  }

  // Check if the authentication server responds
  async GetAuthServerStatus (): Promise<boolean> {

    try {

      this.RetryButton.setVisible(false);
      this.Spinner.setVisible(true);
      this.Message.setText("Connecting to login server").setVisible(true);

      const response = await axios.post<{ success: boolean }>(`${this.AuthServerAddress}/status`);

      if ( response.data.success == true ) {
        this.LoginPanel.setVisible(true);
        //this.ActivePanel = this.LoginPanel;
        //console.log(this.ActivePanel);
        this.Spinner.setVisible(false);
        this.Message.setVisible(false);
        return true;
      }

      throw new Error("Login server offline");

    } catch (error) {

      this.Message.setText("Login server offline");
      this.RetryButton.setVisible(true);
      this.Spinner.setVisible(false);
      return false;

    }

  }

}
