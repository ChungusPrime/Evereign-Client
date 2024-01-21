import Game from "../scenes/game";

export default class OtherPlayer extends Phaser.Physics.Arcade.Sprite {
  
  x: number;
  y: number;
  scene: Game;
  sprite: string;
  socket: string;
  
  constructor ( scene: Game, x: number, y: number, sprite: string, socket: string ) {
    super(scene, x, y, sprite);
    this.scene = scene;
    this.x = x;
    this.y = y;
    this.sprite = sprite;
    this.socket = socket;
    scene.add.existing(this);
    scene.physics.world.enable(this);
  }
  
}