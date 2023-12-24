import Button from "./button";
import Text from "./text";
import Menu from "../scenes/menu";

export default class CharacterList extends Phaser.GameObjects.Container {

  scene: Menu;
  x: number;
  y: number;
  
  constructor(scene: Menu, x: number, y: number) {
    super(scene, x, y);
    this.scene = scene;
    this.x = x;
    this.y = y;

    this.setSize(scene.scale.width, scene.scale.height);

    this.add([
      new Text(scene, scene.scale.width / 2, scene.scale.height * 0.15, "Welcome, Chungus", 96),
      scene.add.rectangle(scene.scale.width * 0.25, scene.scale.height * 0.25, 400, 600, 0x00000, 0.8).setOrigin(0),
      new Text(scene, scene.scale.width * 0.25, scene.scale.height * 0.25, "Characters", 48).setOrigin(0),
      new Button(this.scene, this.scene.scale.width * 0.75, this.scene.scale.height * 0.30, 'button1', 'button2', "Play", this.scene.JoinWorld.bind(this.scene)),
      new Button(this.scene, this.scene.scale.width * 0.75, this.scene.scale.height * 0.40, 'button1', 'button2', "Create Character", this.scene.ShowCreateCharacter.bind(this.scene)),
      new Button(this.scene, this.scene.scale.width * 0.75, this.scene.scale.height * 0.50, 'button1', 'button2', "Server List", this.scene.ShowServerList.bind(this.scene)),
      new Button(this.scene, this.scene.scale.width * 0.75, this.scene.scale.height * 0.60, 'button1', 'button2', "Logout", this.scene.Logout.bind(this.scene))
    ]);
    this.visible = false;

    this.scene.add.existing(this);
  }

  setCharacters ( characters: any[] ) {
    this.getAll().forEach((child) => {
      /*if ( child.isCharacterButton ) {
        this.remove(child);
      }*/
    });
    if ( characters.length > 0 ) {
      var button_y = 0.4;
      characters.forEach((character: { name: string; id: any; }) => {
        var button = new Button(this.scene, this.scene.scale.width * 0.4, this.scene.scale.height * button_y, 'button1', 'button2', character.name, this.scene.SelectCharacter.bind(this.scene, character.id));
        //button.isCharacterButton = true;
        this.add(button);
        button_y += 0.075;
      });
    }
    this.scene.add.existing(this);
  }
  
}
