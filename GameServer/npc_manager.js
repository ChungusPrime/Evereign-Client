class ItemManager {

  constructor (db) {
    this.db = db;
  }

  async GetNPCData () {
    const [Rows] = await this.db.promise().query(`SELECT * FROM data_npcs`);
    this.data = Rows;
    return this.data;
  }

}

module.exports = ItemManager;