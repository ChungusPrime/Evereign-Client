class ItemManager {
  constructor(db) {
    this.db = db;
  }

  async GetItemData() {
    const [rows] = await this.db.promise().query(`SELECT * FROM data_items`);
    return rows;
  }
}

module.exports = ItemManager;