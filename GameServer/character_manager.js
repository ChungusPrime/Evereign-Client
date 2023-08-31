class CharacterManager {

  constructor ( db ) {
    this.db = db;
  }

  async Create ( Character, UserID ) {
    console.log(Character, UserID);

    const Name = Character.name;
    const Class = Character.class;
    const Faction = Character.faction;
    const Race = Character.race;

    const Strength = 0;
    const Intelligence = 0;
    const Willpower = 0;
    const Agility = 0;
    const Endurance = 0;
    const Personality = 0;

    const Level = 1;
    const Experience = 0;
    const Health = 0;
    const Speed = 0;

    const PlayerID = UserID;

    const Area = "";
    const X = 0;
    const Y = 0;

    if ( Faction == "Kingdom" ) {
      //Area = "F01";
      //X = 1;
      //Y = 1;
    } else if ( Faction == "Accord" ) {
      //Area = "H13";
      //X = 1;
      //Y = 1;
    } else if ( Faction == "Reaver Legion" ) {
      //Area = "N6";
      //X = 1;
      //Y = 1;
    }

    /*const result = await this.db.promise().query(`INSERT INTO characters VALUES x = ?, y = ?, area = ? WHERE id = ?`, [ 
      player.x, player.y, player.area, player.id
    ]);
    
    console.log(result);*/

  }

  async GetAccountList( id ) {
    const [characters] = await this.db.promise().query(`SELECT * FROM characters WHERE characters.player_id = ?`, [ id ]);
    return characters;
  }

  async Get ( id, socket ) {

    const [characterResult] = await this.db.promise().query(`SELECT * FROM characters WHERE characters.id = ? LIMIT 1`, [id]);
    const character = characterResult[0];

    const [inventory] = await this.db.promise().query(`SELECT id, item_id, slot FROM character_inventory WHERE character_inventory.character_id = ?`, [id]);
    character.inventory = inventory;

    const [equipment] = await this.db.promise().query(`SELECT id, item_id, slot FROM character_equipment WHERE character_equipment.character_id = ?`, [id]);
    character.equipment = equipment;

    const [currency] = await this.db.promise().query(`SELECT id, currency, amount FROM character_currency WHERE character_currency.character_id = ?`, [id]);
    character.currency = currency;

    const [abilities] = await this.db.promise().query(`SELECT id, ability_id FROM character_abilities WHERE character_abilities.character_id = ?`, [id]);
    character.abilities = abilities;

    const [quickbar] = await this.db.promise().query(`SELECT id, object_id, slot, type FROM character_quickbar WHERE character_quickbar.character_id = ?`, [id]);
    character.quickbar = quickbar;

    character.socket = socket;
    return character;
  }

  async Update ( player ) {
    console.log("Update character ID", player);
    const result = await this.db.promise().query(`UPDATE characters SET x = ?, y = ?, area = ? WHERE id = ?`, [ player.x, player.y, player.area, player.id ]);
    console.log(result);
  }

}

module.exports = CharacterManager;
