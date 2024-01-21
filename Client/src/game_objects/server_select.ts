import Menu from "../scenes/menu";
import Button from "./button";
import ModularButton from "./modular_button";

export default class ServerSelect extends Phaser.GameObjects.Container {

  button_y: number;
  scene: Menu;
  Background: Phaser.GameObjects.Rectangle;
  OriginMarker: Phaser.GameObjects.Text;

  constructor ( scene: Menu, x: number, y: number ) {

    super( scene, 0, 0 );
    
    this.scene = scene;

    this.OriginMarker = this.scene.add.text(0, 0, "X", { align: "center" }).setVisible(false);

    // Get the center of the screen
    this.x = scene.scale.width / 2;
    this.y = scene.scale.height / 2;

    // Set the width and height of the container
    this.width = 500;
    this.height = 400;
    this.displayWidth = 500;
    this.displayHeight = 400;

    // reduce the x and y by half of the width and height to center the container (basically like origin 0.5)
    this.x = this.x - (this.displayWidth / 2);
    this.y = this.y - (this.displayHeight / 2);

    this.Background = scene.add.rectangle(0, 0, this.displayWidth, this.displayHeight, 0x000000, 1).setOrigin(0).setStrokeStyle(2, 0xffffff, 1).setVisible(false);

    this.add([ this.Background, this.OriginMarker ]);
    this.setVisible(false);
    scene.add.existing(this);
  }

  UpdateList() {
    this.button_y = 0;
    this.scene.Servers.forEach(server => {
      let button = new ModularButton(this.scene, 5, 5 + this.button_y, this.displayWidth - 10, 60, "Grey", `${server.name} - ${server.status} - ${server.players} Players`, this.scene.ConnectToGameServer.bind(this.scene, server.name, server.address), 0);
      this.add(button);
      this.button_y += button.button.getBottomCenter().y + 5;
    });
  }
  
}
