import Button from "../classes/button.js";
import Text from "../classes/text.js";

import ServerSelect from "../classes/server_select.js";
import CharacterCreation from "../classes/character_creation.js";
import Login from "../classes/login.js";
import Registration from "../classes/registration.js";
import CharacterList from "../classes/character_list.js";

import axios from 'axios';

export default class Menu extends Phaser.Scene {

  constructor () {
    super("Menu");
  }

  async create () {

    this.input.mouse.disableContextMenu();

    this.SX = this.scale.width / 100;
    this.SY = this.scale.height / 100;

    this.sound.play('music1');
    this.input.setDefaultCursor('url(./assets/images/click_cursor.png), pointer');
    this.add.image(0, 0, 'menu-background').setDisplaySize(this.scale.width, this.scale.height).setOrigin(0);

    // Full width message to show when a request is in progress
    this.message = new Text( this, this.scale.width * 0.5, this.scale.height * 0.5, "Connecting to Authentication Server", 42 );

    // Animated loading icon in the bottom right when a request is in progress
    this.spinner = this.add.image(this.scale.width * 0.93, this.scale.height * 0.90, 'spinner').setDisplaySize(100, 100).setOrigin(0.5);

    // Retry making a connection to the authentication server
    this.retry_button = new Button( this, this.scale.width * 0.5, this.scale.height * 0.9, "button1", "button2", "Retry", this.GetAuthServerStatus.bind(this) );

    // Message to show underneath a form stating the result of a request
    this.auth_message = new Text( this, this.scale.width * 0.5, this.scale.height * 0.90, "", 36 ).setVisible(false);

    // Login form
    this.LoginPanel = new Login(this, 0, 0);

    // Registration form
    this.RegistrationPanel = new Registration(this, 0, 0);

    // Server selection menu
    this.ServerSelectPanel = new ServerSelect(this, 0, 0);

    // Character list
    this.CharacterListPanel = new CharacterList(this, 0, 0);

    // Character Creator
    this.CharacterCreationPanel = new CharacterCreation(this, 0, 0);

    // Currently selected character
    this.CharacterID = null;

    this.offline_button = new Button( this, this.scale.width * 0.1, this.scale.height * 0.1, "button1", "button2", "Offline Test", this.StartOfflineTest.bind(this) );

    // Check if the authentication server is online
    this.GetAuthServerStatus();
  }

  update () {
    this.spinner.rotation += 0.01;
  }

  ShowLoginForm () {
    this.LoginPanel.setVisible(true);
    this.RegistrationPanel.setVisible(false);
  }

  ShowRegistrationForm () {
    this.LoginPanel.setVisible(false);
    this.RegistrationPanel.setVisible(true);
  }

  async GetAuthServerStatus () {

    this.spinner.setVisible(true);
    this.message.setText("Connecting to Authentication Server");
    this.message.setVisible(true);
    this.retry_button.setVisible(false);

    await axios({ method: 'post', url: "http://localhost:8081/status" })
    .then( (result) => {
      console.log(result, "Connected to the authentication server");
      this.LoginPanel.visible = true;
      this.spinner.setVisible(false);
      this.message.setVisible(false);
    })
    .catch( (error) => {
      console.log(error, "Could not connect to the authentication server");
      this.message.setText("Error: Authentication server is offline, please try again later");
      this.retry_button.setVisible(true);
      this.spinner.setVisible(false);
      this.retry_button.setVisible(true);
    });

  }

  async AttemptLogin () {

    this.LoginPanel.setVisible(false);
    this.auth_message.setVisible(false);
    this.message.setText("Attempting to log in");
    this.message.setVisible(true);
    this.spinner.setVisible(true);

    await axios({ method: 'post', url: "http://localhost:8081/login", 
      data: {
        username: this.LoginPanel.getAt(2).getChildByName('username').value,
        password: this.LoginPanel.getAt(2).getChildByName('password').value
      }
    })
    .then( (result) => {
      console.log(result);
      this.user = result.data.user;
      this.auth_message.setText(result.data.message);
      this.auth_message.setVisible(true);
      this.spinner.setVisible(false);
      this.message.setVisible(false);
      this.LoginPanel.setVisible(false);
      this.ServerSelectPanel.setServers(result.data.servers);
      this.ServerSelectPanel.setVisible(true);
    })
    .catch( (error) => {
      console.log(error);
      this.auth_message.setText("Incorrect username or password");
      this.auth_message.setVisible(true);
      this.spinner.setVisible(false);
      this.message.setVisible(false);
      this.LoginPanel.setVisible(true);
    });

  }

  async AttemptRegistration () {

    this.LoginPanel.setVisible(false);
    this.auth_message.setVisible(false);
    this.message.setText("Attempting create your account");
    this.message.setVisible(true);
    this.spinner.setVisible(true);

    await axios({ method: 'post', url: "http://localhost:8081/create_account", 
      data: {
        username: this.RegistrationPanel.getAt(2).getChildByName('username').value,
        password: this.RegistrationPanel.getAt(2).getChildByName('password').value,
        email: this.RegistrationPanel.getAt(2).getChildByName('email').value,
      }
    })
    .then( (result) => {
      console.log(result);
      this.auth_message.setText(result.data.message);
      this.auth_message.setVisible(true);
      this.spinner.setVisible(false);
      this.message.setVisible(false);
    })
    .catch( (error) => {
      this.auth_message.setText("Account could not be created");
      this.auth_message.setVisible(true);
      this.spinner.setVisible(false);
      this.message.setVisible(false);
    });

    this.RegistrationPanel.setVisible(false);
    this.LoginPanel.setVisible(true);
  }

  async ConnectToGameServer ( server, address ) {

    console.log(server, address);

    this.auth_message.setVisible(false);
    this.ServerSelectPanel.setVisible(false);
    this.message.setText(`Connecting to ${server}`);
    this.message.setVisible(true);
    this.spinner.setVisible(true);

    await axios({ method: 'post', url: `${address}/status`, 
      data: {
        id: this.user.id
      }
    })
    .then( (result) => {
      console.log(result);
      this.auth_message.setText("Connected");
      this.auth_message.setVisible(true);
      this.spinner.setVisible(false);
      this.message.setVisible(false);
      this.ServerSelectPanel.setVisible(false);
      this.CharacterListPanel.setCharacters(result.data.characters);
      this.CharacterListPanel.setVisible(true);
    })
    .catch( (error) => {
      console.log(error);
      this.auth_message.setText("Could not connect to game server");
      this.auth_message.setVisible(true);
      this.spinner.setVisible(false);
      this.message.setVisible(false);
      this.ServerSelectPanel.setVisible(true);
    });

  }

  ShowServerList () {
    this.ServerSelectPanel.setVisible(true);
    this.CharacterListPanel.setVisible(false);
  }

  SelectCharacter ( id ) {
    console.log(id);
    this.CharacterID = id;
  }

  JoinWorld () {
    console.log(this.CharacterID);
    if ( this.CharacterID == null ) return;
    this.scene.start("Game", { CharacterID: this.CharacterID } );
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

  }

  async AttemptToCreateCharacter ( character ) {

    console.log( character );

    const result = await axios({
      method: 'post',
      url: 'http://localhost:8082/create_character',
      data: {
        Character: character,
        UserID: this.user.id
      }
    });

    console.log(result);
    return;
    self.MakeCharacterSlot({ id: response.id, name: CharacterName, class: CharacterClass, faction: CharacterFaction, race: CharacterRace });
    self.CancelCharacterCreation();
  }

  ShowRegistrationPage () {
    this.LoginPanel.visible = false;
    this.RegistrationPanel.visible = true;
  }

  testScene() {
    this.scene.start("Game", { character: 1, server: "localhost:8082" });
  }

  StartOfflineTest () {
    this.scene.start("OfflineGame");
  }

}
