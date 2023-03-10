class ItemManager {

  constructor (itemData) {
    this.itemData = itemData;
    console.log("Item Manager Initialised");
  }

  Get ( id ) {
    return this.itemData.find(v => v.item_id == id);
  }

}

module.exports = ItemManager;
