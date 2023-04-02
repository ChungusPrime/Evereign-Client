export default class ReputationPanel extends Phaser.GameObjects.Container {

  constructor (scene, x, y) {
    super(scene, x, y);
    this.scene = scene;
    this.x = x;
    this.y = y;
    this.setSize(400, 500);
    this.setVisible(false);
    this.panelName = "Reputation";
  }

}
