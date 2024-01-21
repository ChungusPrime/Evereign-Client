import Button from "./button";
import ModularButton from "./modular_button";
import Text from "./text";
import Menu from "../scenes/menu";

export default class CharacterList extends Phaser.GameObjects.Container {

  scene: Menu;
  x: number;
  y: number;
  PlayButton: Button;
  CreateCharacterButton: Button;
  BackToServerListButton: Button;
  LogoutButton: Button;
  CharacterListHeader: Phaser.GameObjects.Text;
  CharacterListBackground: Phaser.GameObjects.Rectangle;
  
  constructor ( scene: Menu, x: number, y: number ) {

    super( scene, x, y );

    this.scene = scene;
    this.x = x;
    this.y = y;

    this.PlayButton = new Button(this.scene, this.scene.scale.width * 0.75, this.scene.scale.height * 0.30, 'button1', 'button2', "Play", this.scene.JoinWorld.bind(this.scene));
    this.CreateCharacterButton = new Button(this.scene, this.scene.scale.width * 0.75, this.scene.scale.height * 0.40, 'button1', 'button2', "Create Character", this.scene.ShowCreateCharacter.bind(this.scene));
    this.BackToServerListButton = new Button(this.scene, this.scene.scale.width * 0.75, this.scene.scale.height * 0.50, 'button1', 'button2', "Server List", this.scene.ShowServerList.bind(this.scene));
    this.LogoutButton = new Button(this.scene, this.scene.scale.width * 0.75, this.scene.scale.height * 0.60, 'button1', 'button2', "Logout", this.scene.Logout.bind(this.scene));

    this.CharacterListHeader = scene.add.text(this.scene.scale.width * 0.1, this.scene.scale.height * 0.1, "Characters", { fontSize: "24px", fontFamily: 'Mooli' });

    this.CharacterListBackground = scene.add.rectangle(
      this.CharacterListHeader.getBottomLeft().x,
      this.CharacterListHeader.getBottomLeft().y + 20,
      this.scene.scale.width * 0.25,
      this.scene.scale.height * 0.75,
      0x000000,
      1
    ).setOrigin(0).setStrokeStyle(2, 0xffffff, 1);

    this.setSize(scene.scale.width, scene.scale.height);

    this.add([
      this.CreateCharacterButton,
      this.BackToServerListButton,
      this.PlayButton,
      this.LogoutButton,
      this.CharacterListHeader,
      this.CharacterListBackground
    ]);

    this.visible = false;

    this.scene.add.existing(this);
  }

  UpdateList ( characters: any[] ) {
    
    let button_y: number = this.CharacterListBackground.getTopLeft().y;

    characters.forEach((character: { name: string; id: string; level: string }) => {
      
      let button = new ModularButton(
        this.scene,
        this.CharacterListBackground.getTopLeft().x,
        button_y,
        this.CharacterListBackground.width,
        50,
        "Grey",
        `${character.name} - Level ${character.level}`,
        this.scene.SelectCharacter.bind(this.scene, character.id),
        0
      );

      this.add(button);
      button_y = button.button.getBottomLeft().y + 10;
    });

    this.scene.add.existing(this);
  }
  
}
