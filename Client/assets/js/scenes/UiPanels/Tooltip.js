export default class Tooltip extends Phaser.GameObjects.Container {

  constructor (scene) {
    super(scene, 200, 200);
    this.scene = scene;
    this.x = 500;
    this.y = 500;
    this.setVisible(false);
    this.open = false;

    this.title = this.scene.add.text(5, 5, "Placeholder", {
      fontSize: '20px', fill: '#fff',
      wordWrap: { width: 290 }
    });

    this.text = this.scene.add.text(5, 60, "TextPlaceholder", {
      fontSize: '16px', fill: '#fff',
      wordWrap: { width: 290 }
    });

    this.add([
      this.scene.add.graphics().fillStyle(0x000000, 0.8).fillRoundedRect(0, 0, 300, 300, 8),
      this.title,
      this.text
    ]);

    this.scene.add.existing(this);

  }

  Show (type, data, pointer) {
    console.log(pointer);
    this.setVisible(true);
    //this.setPosition(pointer.downX + 25, pointer.downY + 25);
    this.title.setText(data.name);
    this.text.setText(data.name);
  }

  Hide () {
    this.setVisible(false);
    this.title.setText("Title");
    this.text.setText("Text");
  }

}
