class ItemManager {

  constructor (db) {
    this.db = db;
  }

  async GetItemData () {
    const [Rows] = await this.db.promise().query(`SELECT * FROM data_items`);
    this.data = Rows;
    return true;
  }

}

module.exports = ItemManager;