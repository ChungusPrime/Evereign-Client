export default class Quickbar extends Phaser.GameObjects.Container {

  constructor (scene, quickbar) {
    super(scene, 680, 1000);
    this.scene = scene;
    this.x = 680;
    this.y = 1000;
    this.slots = [];

    var x = 0;
    for (var i = 0; i < 8; i++) {
      var slot = this.scene.add.container(x, 0, [
        this.scene.add.sprite(0, 0, 'button4').setOrigin(0).setScale(1.5),
        this.scene.add.text(5, 5, i + 1).setOrigin(0)
      ]).setInteractive(new Phaser.Geom.Rectangle(0, 0, 65, 65), Phaser.Geom.Rectangle.Contains, true);
      x += 80;
      slot.slot = i + 1;
      slot.contains = null;
      this.slots.push(slot);
      this.add(slot);
    }

    this.scene.add.existing(this);

    quickbar.forEach((obj, i) => {
      var slot = this.slots.find(s => s.slot == obj.slot);

      if ( obj.type == "ability" ) {
        var data = this.scene.abilityData.find(a => a.id == obj.object_id);
        var sprite = slot.add(this.scene.add.sprite(2, 2, 'skills_b', data.sprite).setOrigin(0).setScale(2));
        slot.contains = sprite;
      }

      if ( obj.type == "item" ) {
        //slot.add(this.scene.add.sprite(4, 4, 'items').setOrigin(0).setScale(1.5));
      }

    });

    console.log(this.slots);

  }

}
