import Menu from "../scenes/menu";
import Button from "./button";
import Text from "./text";

export default class ServerSelect extends Phaser.GameObjects.Container {
  button_y: number;
  scene: Menu;

  servers: Array<{name: string, address: string}> = [
    { 'name': "Sentinel", 'address': "http://localhost:8082" },
    { 'name': "Crown", 'address': "http://localhost:8083" },
    { 'name': "Phantom", 'address': "http://localhost:8084" },
    { 'name': "Reaver", 'address': "http://localhost:8085" }
  ];
  
  constructor ( scene: Menu, x: number, y: number ) {
    super(scene, x, y);
    this.scene = scene;
    this.x = x;
    this.y = y;
    this.button_y = 0.38;
    this.add(scene.add.rectangle(scene.scale.width * 0.5, scene.scale.height * 0.5, 475, 400, 0x00000, 0.75).setOrigin(0.5).setStrokeStyle(1, 0xffffff, 1),);
    this.setVisible(false);
    this.servers.forEach(server => {
      const button = new Button(this.scene, this.scene.scale.width * 0.5, this.scene.scale.height * this.button_y, 'button1', 'button2', server.name, this.scene.ConnectToGameServer.bind(this.scene, server.name, server.address));
      this.add(button);
      this.button_y += 0.075;
    });
    this.scene.add.existing(this);
  }
  
}
