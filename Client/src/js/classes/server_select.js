import Button from "./button.js";
import Text from "./text.js";

export default class ServerSelect extends Phaser.GameObjects.Container {
  
  constructor(scene, x, y) {

    super(scene, x, y);

    this.scene = scene;
    this.x = x;
    this.y = y;

    this.button_y = 0.38;

    this.setSize(scene.scale.width, scene.scale.height);

    this.add([
      scene.add.image(scene.scale.width * 0.5, scene.scale.height * 0.5, 'panel').setDisplaySize(475, 400).setOrigin(0.5),
      new Text(scene, scene.scale.width / 2, scene.scale.height * 0.15, "Evereign", 96),
      new Text(scene, scene.scale.width / 2, scene.scale.height * 0.25, "Choose a Server", 64)
    ]);

    this.visible = false;
  }

  setServers ( servers ) {

    if ( servers != null ) {

      servers.forEach(server => {
        this.add( new Button(this.scene, this.scene.scale.width * 0.5, this.scene.scale.height * this.button_y, 'button1', 'button2', server.name, this.scene.ConnectToGameServer.bind(this.scene, server.name, server.address)) );
        this.button_y += 0.075;
      });
  
      this.scene.add.existing(this);

    }

  }
  
}
