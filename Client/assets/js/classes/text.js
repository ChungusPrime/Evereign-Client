export default class Text extends Phaser.GameObjects.Text {

    constructor ( scene, x, y, text, size = 24, wrap = false ) {

      super (scene, x, y, text, {
        fontSize: `${size}px`,
        fill: "#fff",
        wordWrap: wrap,
        fontFamily: 'Mooli'
      });

      this.setOrigin(0.5);
      this.preFX.addShadow(0, 0, 0.06, 0.75, 0x000000, 4, 0.8);
      scene.add.existing(this);
    }
  
    // You can add custom methods here. For example:
    setRed() {
      this.setColor('red');
    }

    setWrapWidth () {
      
    }

  }