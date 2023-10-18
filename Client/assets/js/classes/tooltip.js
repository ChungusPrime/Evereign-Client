export default class Tooltip extends Phaser.GameObjects.Image {

    constructor ( scene, x, y ) {
      super (scene, x, y, 'panel');
      scene.add.existing(this);
      this.setOrigin(0);
      this.setDisplaySize(100, 100)
      this.setVisible(false);
    }

    Show () {
      this.setVisible(true);
    }

    Hide () {
      this.setVisible(false);
    }

}