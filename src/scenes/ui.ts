import Tooltip from "../game_objects/tooltip";
import Game from "./game";

export default class UI extends Phaser.Scene {
  
  GameScene: Game;

  position_text: Phaser.GameObjects.Text;
  tooltip: Tooltip;

  // Bars
  HealthBar: Phaser.GameObjects.Image;
  ResourceBar: Phaser.GameObjects.Image;
  XpBar: Phaser.GameObjects.Image;
  AttackBar: Phaser.GameObjects.Image;

  // Minimap
  MinimapCamera: Phaser.Cameras.Scene2D.Camera;
  minimap: Phaser.GameObjects.Image;
  minimapBackground: Phaser.GameObjects.Rectangle;

  // Chat
  ChatBackground: Phaser.GameObjects.Rectangle;
  ChatContent: Phaser.GameObjects.Container;
  ChatCamera: Phaser.Cameras.Scene2D.Camera;

  constructor () {
    super("UI");
  }
  
  create ( scene: Game ) {

    this.GameScene = scene;

    this.position_text = this.add.text(this.scale.width - 310, 5, `X: ${this.GameScene.Player.x} - Y: ${this.GameScene.Player.y}` ).setOrigin(1, 0);

    /* Tooltip */
    this.tooltip = new Tooltip(this, this.scale.width * 0.8, this.scale.height * 0.8);

    this.GameScene.events.on("ShowTooltip", this.ShowTooltip, this);
    this.GameScene.events.on("HideTooltip", this.HideTooltip, this);

    this.HealthBar = this.add.image(1, 0, 'red-bar' ).setDisplaySize(250, 20).setOrigin(0);
    this.ResourceBar = this.add.image(1, 20, 'blue-bar' ).setDisplaySize(250, 20).setOrigin(0);
    this.XpBar = this.add.image(1, 40, 'green-bar' ).setDisplaySize(250, 20).setOrigin(0);
    this.AttackBar = this.add.image(1, 60, 'yellow-bar' ).setDisplaySize(250, 20).setOrigin(0);

    /* Minimap setup */
    this.minimapBackground = this.add.rectangle(this.scale.width - 305, 5, 300, 300, 0x000000, 1).setOrigin(0);
    this.minimap = this.add.image(this.minimapBackground.getTopLeft().x + 5, this.minimapBackground.getTopLeft().y + 5, "D1-Minimap").setDisplaySize(290, 290).setOrigin(0).setInteractive();
    this.MinimapCamera = this.cameras.add(this.minimapBackground.getTopLeft().x + 5, this.minimapBackground.getTopLeft().y + 5, 290, 290, false, "MinimapCamera");
    this.MinimapCamera.setBounds(this.scale.width - 300, 1, 290, 290);
    
    this.minimap.on("pointermove", ( pointer: Phaser.Input.Pointer ) => {
      if ( !pointer.isDown ) return;
      this.minimap.x -= (pointer.x - pointer.prevPosition.x) / this.MinimapCamera.zoom;
      this.minimap.y -= (pointer.y - pointer.prevPosition.y) / this.MinimapCamera.zoom;
    });

    this.minimap.on("wheel", ( pointer: Phaser.Input.Pointer ) => {
      this.MinimapCamera.zoom += 0.1;
      console.log(this.minimap.scale);
      //this.minimap.scale += pointer.deltaY / 10000;
      //if ( this.minimap.scale < 1 ) {
      //  this.minimap.scale = 1;
      //}
    });

    /* Chat Window */
    this.ChatBackground = this.add.rectangle(5, this.scale.height - 205, 500, 200, 0x000000, 1).setOrigin(0).setInteractive();
    this.ChatContent = this.add.container(5, this.scale.height - 205);
    let test_text = this.add.text(5, 5, "hello\nhello\nhello\nhello\nhello\nhello\nhello\nhello\nhello\nhello\nhello\nhello\nhello\nhello\nhello\nhello\nhello\nhello\nhello\nhello\nhello\nhello\nhello\nhello\nhello\nhello\nhello\nhello\nhello\nhello\nhello\nhello\nhello\nhello\nhello\nhello\n");
    this.ChatContent.add(test_text);
    this.ChatCamera = this.cameras.add(this.ChatBackground.getTopLeft().x + 5, this.ChatBackground.getTopLeft().y + 5, 495, 195, false, "ChatCamera");

    let height = 0;

    this.ChatContent.getAll().forEach( (child: Phaser.GameObjects.Text) => {
        height += child.height;
    });

    height += 5;

    this.ChatCamera.setBounds(this.ChatBackground.getTopLeft().x + 5, this.ChatBackground.getTopLeft().y + 5, 495, height);

    this.ChatBackground.on("wheel", ( pointer: Phaser.Input.Pointer ) => {
      console.log("scrolling chat")
      this.ChatCamera.scrollY += pointer.deltaY;
    });
    //this.NewChatMessage("Welcome to Evereign!");

    this.cameras.main.ignore([this.minimap, this.ChatContent]);
    this.ChatCamera.ignore([this.position_text, this.HealthBar, this.ResourceBar, this.XpBar, this.AttackBar, this.tooltip, this.ChatBackground]);
    this.MinimapCamera.ignore([this.position_text, this.HealthBar, this.ResourceBar, this.XpBar, this.AttackBar, this.tooltip, this.ChatBackground]);
  }

  update () {
    this.position_text.setText(`X: ${this.GameScene.Player.x} - Y: ${this.GameScene.Player.y}`);
    //if ( this.GameScene.player.basicAttackCooldown > 0 ) {
      //this.attack_bar.setDisplaySize( (this.GameScene.player.basicAttackCooldown / this.GameScene.player.basicAttackCooldownMax) * 100 * 2, 15);
    //}
  }

  ToggleMenu ( name: string ) {
    console.log(`Show ${name} panel`);
  }

  ShowTooltip ( data: any ) {
    console.log("hello", data);
    this.tooltip.Show();
  }

  HideTooltip ( data: any ) {
    console.log("hiding");
    this.tooltip.Hide();
  }

  NewChatMessage ( text: string ) {
    const element = document.createElement("p");
    element.innerHTML = text;
    //this.chatwindow.getChildByID('chat-box').appendChild(element);
  }

}
