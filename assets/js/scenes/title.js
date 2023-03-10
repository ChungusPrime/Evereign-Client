import Button from "../classes/button.js";

export default class Title extends Phaser.Scene {

  constructor () {
    super("Title");
  }

  preload () {
    this.load.html('AuthenticationForm', 'assets/text/Authentication.html');
    this.load.html('CharacterCreationForm', 'assets/text/CharacterCreation.html');
  }

  create () {

    this.physics.world.enable(this);

    this.graphics = this.add.graphics();

    // Login Panel //
    this.loginPanel = this.add.container(0, 0).setSize(this.scale.width, this.scale.height);
    this.loginForm = this.add.dom(this.scale.width / 2, this.scale.height / 2).createFromCache('AuthenticationForm');
    this.titleText = this.add.text(this.scale.width / 2, this.scale.height * 0.25, "Evereign", { fontSize: "64px", fill: "#fff" }).setOrigin(0.5);
    this.loginButton = new Button(this, this.scale.width / 2, this.scale.height * 0.75, 'button1', 'button2', 'Login', this.AttemptLogin.bind(this)).setScale(0.65);
    this.signUpButton = new Button(this, this.scale.width / 2, this.scale.height * 0.85, 'button1', 'button2', 'Sign Up', this.AttemptRegistration.bind(this)).setScale(0.65);

    this.testButton = new Button(this, this.scale.width / 2, this.scale.height * 0.95, 'button1', 'button2', 'Test Game', this.testScene.bind(this)).setScale(0.65);
    this.test2Button = new Button(this, 150, this.scale.height * 0.95, 'button1', 'button2', 'Test Game 2', this.testScene2.bind(this)).setScale(0.65);

    this.loginPanel.add([
      this.loginForm,
      this.titleText,
      this.loginButton,
      this.signUpButton,
      this.testButton,
      this.test2Button
    ]);

    // Main Menu //
    this.menuScreen = this.add.container(0, 0).setSize(this.scale.width, this.scale.height);
    this.welcomeHeader = this.add.text(this.scale.width / 2, 50, "Welcome back, ", { fontSize: "32px", fill: "#fff" }).setOrigin(0.5);
    this.charactersHeader = this.add.text(this.scale.width / 2, 100, "Your Characters", { fontSize: "32px", fill: "#fff" }).setOrigin(0.5);

    this.characterContainer = this.add.container(135, 150, [
      this.graphics.fillStyle(0x009888).fillRoundedRect(0, 0, 535, 220, 8)
    ]).setSize(535, 220);

    this.startButton = new Button(this, this.scale.width / 2, this.scale.height * 0.75, 'button1', 'button2', 'Enter World', this.startScene.bind(this)).setScale(0.65);
    this.createCharButton = new Button(this, this.scale.width / 2, this.scale.height * 0.85, 'button1', 'button2', 'Create Character', this.CreateCharacter.bind(this)).setScale(0.65);

    this.menuScreen.add([
      this.welcomeHeader,
      this.charactersHeader,
      this.characterContainer,
      this.startButton,
      this.createCharButton,
    ]);

    this.menuScreen.visible = false;

    // Create Character Screen //
    this.createCharacterPanel = this.add.container(0, 0).setSize(this.scale.width, this.scale.height);
    this.newCharacterHeader = this.add.text(this.scale.width / 2, 100, "New Character", { fontSize: "32px", fill: "#fff" }).setOrigin(0.5);
    this.confirmCreationButton = new Button(this, this.scale.width / 2, this.scale.height * 0.75, 'button1', 'button2', 'Create', this.CreateNewCharacter.bind(this)).setScale(0.65);
    this.cancelCreationButton = new Button(this, this.scale.width / 2, this.scale.height * 0.85, 'button1', 'button2', 'Cancel', this.CancelCharacterCreation.bind(this)).setScale(0.65);
    this.createCharacterForm = this.add.dom(this.scale.width / 2, this.scale.height / 2).createFromCache('CharacterCreationForm');

    this.createCharacterPanel.add([
      this.newCharacterHeader,
      this.confirmCreationButton,
      this.cancelCreationButton,
      this.createCharacterForm
    ]);

    this.createCharacterPanel.visible = false;

    this.charPosX = 5;
    this.charPosY = 5;
    this.charCount = 0;
  }

  SetPlayerData(id, username, characters) {
    this.loginPanel.visible = false;
    this.playerID = id;
    this.characters = characters;
    this.selectedChar = null;
    this.menuScreen.getAt(0).setText(`Welcome back, ${username}`);
    this.menuScreen.getAt(1).setText(`Your Characters (${characters.length}/10)`);

    this.characters.forEach(function (k, v) {
      this.MakeCharacterSlot(k);
    }, this);

    this.menuScreen.visible = true;
  }

  MakeCharacterSlot (character) {
    var bg = this.add.graphics().fillStyle(0x185DE8).fillRoundedRect(0, 0, 100, 100, 8);
    var sprite = this.add.sprite(50, 30, 'characters', 0).setOrigin(0.5).setScale(1.5);
    var name = this.add.text(50, 80, character.name, { fontSize: "14px", fill: "#fff" }).setOrigin(0.5);
    var className = this.add.text(50, 90, character.class, { fontSize: "14px", fill: "#fff" }).setOrigin(0.5);
    var slot = this.add.container(this.charPosX, this.charPosY, [bg, sprite, name, className]).setSize(100, 100);
    sprite.setInteractive();
    sprite.on('pointerdown', () => { this.selectedChar = character.id });
    this.characterContainer.add(slot);
    this.charPosX = this.charPosX + 105;
    this.charCount++;

    if ( this.charCount == 5 ) {
      this.charPosX = 5;
      this.charPosY = 110;
    }

  }

  CreateCharacter () {
    this.menuScreen.visible = false;
    this.createCharacterPanel.visible = true;
  }

  CancelCharacterCreation () {
    this.menuScreen.visible = true;
    this.createCharacterPanel.visible = false;
  }

  CreateNewCharacter() {
    var charName = this.createCharacterForm.getChildByName('name').value;
    var charClass = this.createCharacterForm.getChildByName('class').value;
    var charFaction = this.createCharacterForm.getChildByName('faction').value;
    var charRace = this.createCharacterForm.getChildByName('faction').value;
    if ( charName == "" ) return;
    let xhr = new XMLHttpRequest()
    xhr.open('POST', "/auth/create_character", true)
    xhr.setRequestHeader('Content-type', 'application/json; charset=UTF-8')
    xhr.send(JSON.stringify({ id: this.playerID, name: charName, class: charClass, faction: charFaction, race: charRace }));
    var self = this;
    xhr.onload = function () {
      if(xhr.status !== 200) return;
      var response = JSON.parse(xhr.response);
      self.MakeCharacterSlot({ id: response.id, name: charName, class: charClass, faction: charFaction, race: charRace });
      self.CancelCharacterCreation();
    }
  }

  AttemptLogin () {
    var Username = this.loginForm.getChildByName('username').value;
    var Password = this.loginForm.getChildByName('password').value;
    let xhr = new XMLHttpRequest()
    xhr.open('POST', "/auth/login", true)
    xhr.setRequestHeader('Content-type', 'application/json; charset=UTF-8')
    xhr.send(JSON.stringify({ username: Username, password: Password }));
    var self = this;
    xhr.onload = function () {
      if(xhr.status !== 200) return;
      var response = JSON.parse(xhr.response);
      self.SetPlayerData(response.user, response.username, response.characters);
    }
  }

  AttemptRegistration () {
    var Username = this.loginForm.getChildByName('username').value;
    var Password = this.loginForm.getChildByName('password').value;
    let xhr = new XMLHttpRequest()
    xhr.open('POST', "/auth/signup", true)
    xhr.setRequestHeader('Content-type', 'application/json; charset=UTF-8')
    xhr.send(JSON.stringify({ username: Username, password: Password }));
    xhr.onload = function () {
      if(xhr.status === 200) console.log(JSON.parse(xhr.response));
    }
  }

  startScene() {
    if ( this.selectedChar == null || this.selectedChar == undefined ) return;
    this.scene.start("Game", { character: this.selectedChar } );
  }

  testScene() {
    this.scene.start("Game", { character: 1 });
  }

  testScene2() {
    this.scene.start("Game", { character: 2 });
  }

}
