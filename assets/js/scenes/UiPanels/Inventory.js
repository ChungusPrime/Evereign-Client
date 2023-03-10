export default class InventoryPanel extends Phaser.GameObjects.Container {

  constructor (scene, inventory) {

    super(scene, 1020, 200);

    this.scene = scene;
    this.x = 1020;
    this.y = 200;

    this.setVisible(false);

    this.panelName = "Inventory";

    this.title = this.scene.add.text(25, 30, 'Inventory', { fontSize: '16px', fill: '#fff' });
    this.slots = [];
    this.add( this.scene.add.sprite(0, 0, `panel-dark`).setOrigin(0).setScale(4, 5) );
    this.add( this.title );
    this.scene.add.existing(this);

    // set up slots
    var x = 25;
    var y = 50;

    for (var i = 1; i < 22; i++) {

      var slot = this.scene.add.container(x, y, [
        this.scene.add.sprite(0, 0, 'button4').setOrigin(0)
      ]).setInteractive(new Phaser.Geom.Rectangle(0, 0, 50, 50), Phaser.Geom.Rectangle.Contains, true);

      slot.slot = i;
      slot.contains = null;

      this.slots.push(slot);
      this.add(slot);

      x += 50;

      if ( i % 7 == 0 ) {
        x = 25;
        y += 50;
      }

    }

    inventory.forEach((v, i) => {
      this.addItem(v);
    });

  }

  /*
    Create a new item sprite, and assign the provided data
  */
  addItem (data) {

    var itemData = this.scene.itemData.find(i => i.item_id == data.item_id);

    var item = this.scene.add.sprite(22, 22, itemData.type, itemData.sprite).setScale(1.5).setInteractive();
    Object.assign(item, data);
    item.is = "item";

    item.on('pointerover', (pointer) => {
      item.setTint(0x00ff00);
      this.scene.Tooltip.Show("item", itemData, pointer);
    });

    item.on('pointerout', () => {
      item.clearTint();
      this.scene.Tooltip.Hide();
    });

    this.scene.input.setDraggable(item);
    var slot = this.slots.find(s => s.contains == null);
    slot.contains = item;
    item.inSlot = slot.slot;
    slot.add(item);
  }

  removeItem () {

  }

}
