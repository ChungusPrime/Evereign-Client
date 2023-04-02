class CharacterManager {

  constructor ( database, abilityData, itemData ) {
    this.database = database;
    this.abilityData = abilityData;
    this.itemData = itemData;
  }

  async GetCharacter (id, socket) {

    const [characterResult] = await this.database.promise().query(`SELECT * FROM characters WHERE characters.id = ? LIMIT 1`, [id]);
    const character = characterResult[0];

    const [inventory] = await this.database.promise().query(`SELECT id, item_id, slot FROM character_inventory WHERE character_inventory.character_id = ?`, [id]);
    character.inventory = inventory;

    const [equipment] = await this.database.promise().query(`SELECT id, item_id, slot FROM character_equipment WHERE character_equipment.character_id = ?`, [id]);
    character.equipment = equipment;

    const [currency] = await this.database.promise().query(`SELECT id, currency, amount FROM character_currency WHERE character_currency.character_id = ?`, [id]);
    character.currency = currency;

    const [abilities] = await this.database.promise().query(`SELECT id, ability_id FROM character_abilities WHERE character_abilities.character_id = ?`, [id]);
    character.abilities = abilities;

    const [quickbar] = await this.database.promise().query(`SELECT id, object_id, slot, type FROM character_quickbar WHERE character_quickbar.character_id = ?`, [id]);
    character.quickbar = quickbar;

    character.socket = socket;
    return character;
  }

  async UpdateCharacter ( id ) {
    console.log("Update character ID", id);

  }

}

module.exports = CharacterManager;
