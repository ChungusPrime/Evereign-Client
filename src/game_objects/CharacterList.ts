import Button from "./button";
import ModularButton from "./ModularButton";
import Menu from "../scenes/menu";

export default class CharacterList extends Phaser.GameObjects.Container {

  scene: Menu;
  x: number;
  y: number;

  // Buttons
  PlayButton: Button;
  CreateCharacterButton: Button;
  BackToServerListButton: Button;
  LogoutButton: Button;
  
  constructor ( scene: Menu, x: number, y: number ) {

    super( scene, x, y );

    this.scene = scene;
    this.x = x;
    this.y = y;

    this.CreateCharacterButton = new ModularButton( this.scene, 0, 0, 200, 60, "Grey", "Create Character", this.ShowCreateCharacter.bind(this), 0 );
    this.PlayButton = new Button(this.scene, this.scene.scale.width * 0.75, this.scene.scale.height * 0.30, 'button1', 'button2', "Play", this.JoinWorld.bind(this));
    this.BackToServerListButton = new Button(this.scene, this.scene.scale.width * 0.75, this.scene.scale.height * 0.50, 'button1', 'button2', "Server List", this.ShowServerList.bind(this));
    this.LogoutButton = new Button(this.scene, this.scene.scale.width * 0.75, this.scene.scale.height * 0.60, 'button1', 'button2', "Logout", this.Logout.bind(this));

    this.add([
      this.CreateCharacterButton,
      this.BackToServerListButton,
      this.PlayButton,
      this.LogoutButton,
    ]);

    this.setVisible(false);
    this.scene.add.existing(this);
  }

  UpdateList ( characters: any[] ) {
    /*try {
      let button_y: number = 5;
      characters.forEach((character: { name: string; id: string; level: string }) => {

        let button = new ModularButton( 
          this.scene,
          this.Panel.ContentBackground.getTopLeft().x,
          button_y,
          this.Panel.ContentBackground.width - 10,
          80,
          "Grey",
          `${character.name}\nLevel ${character.level}`,
          this.SelectCharacter.bind(this, character.id),
          0
        );

        this.Panel.ContentContainer.add(button);
        button_y += button.button.getBottomLeft().y + 5;
      });
    } catch (error) {
      console.log(error);
    }
    this.Panel.setCameraBoundsHeight();*/
  }

  ShowCreateCharacter () {
    this.scene.CharacterListPanel.setVisible(false);
    this.scene.CharacterCreationPanel.Container.setVisible(true);
  }

  SelectCharacter ( id: number ) {
    this.scene.CharacterID = id;
    console.log(this.scene.CharacterID);
  }

  JoinWorld () {
    console.log(`LOAD GAME - CharID: ${this.scene.CharacterID} - AccountID: ${this.scene.AccountID} - Server: ${this.scene.Server}`);
    if ( this.scene.CharacterID == null || this.scene.AccountID == null || this.scene.Server == null ) {

    }
    return;
    this.scene.sound.stopByKey('music1');
    this.scene.scene.stop("Menu");
    this.scene.scene.start("Game", {
      AccountID: this.scene.AccountID,
      CharacterID: this.scene.CharacterID,
      Server: this.scene.Server
    });
  }

  ShowServerList () {
    this.scene.ServerSelectPanel.Show();
    this.setVisible(false);
  }

  Logout () {
    console.log("do the logout, yo");
  }
  
}
