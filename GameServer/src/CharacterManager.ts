import Character from "./Character";
import Database from "./db";

export default class CharacterManager {

  db: Database;

  constructor ( db: Database ) {
    this.db = db;
  }

  async CreateCharacter ( Character: Character, UserID: number ) {

    console.log(Character, UserID);
    const Name = Character.name;
    const Class = Character.base_class;
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

    let Area = "";
    let X = 0;
    let Y = 0;

    if ( Faction == "Kingdom" ) {
      Area = "E1";
      X = 329;
      Y = 3135;
    } else if ( Faction == "Accord" ) {
      //Area = "B7";
      //X = 1;
      //Y = 1;
    } else if ( Faction == "Reaver" ) {
      //Area = "B2";
      //X = 1;
      //Y = 1;
    }

    const result = await this.db.Query(`INSERT INTO characters VALUES(
      name = ?, class = ?, area = ?, x = ?, y = ?, level = ?, player_id = ?, faction = ?)`, [ 
      Name, Class, Area, X, Y, Level, UserID, Faction
    ]);
    
    console.log(result);
    return result;
  }

  async GetAccountList( id: string ) {
    const [characters] = await this.db.Query("SELECT * FROM `characters` WHERE `characters`.player_id = ?", [ id ]);
    return characters;
  }

  async GetCharacter ( id: string, socketID: string ): Promise<Character> {

    const result = await this.db.Query("SELECT * FROM `characters` WHERE `characters`.id = ? LIMIT 1", [id]);

    let Char = new Character(result.id, result.x, result.y, result.name, result.class, result.faction, result.race, socketID, result.area);

    /*const [inventory] = await this.db.promise().query(`SELECT id, item_id, slot FROM character_inventory WHERE character_inventory.character_id = ?`, [id]);
    character.inventory = inventory;

    const [equipment] = await this.db.promise().query(`SELECT id, item_id, slot FROM character_equipment WHERE character_equipment.character_id = ?`, [id]);
    character.equipment = equipment;

    const [currency] = await this.db.promise().query(`SELECT id, currency, amount FROM character_currency WHERE character_currency.character_id = ?`, [id]);
    character.currency = currency;

    const [abilities] = await this.db.promise().query(`SELECT id, ability_id FROM character_abilities WHERE character_abilities.character_id = ?`, [id]);
    character.abilities = abilities;

    const [quickbar] = await this.db.promise().query(`SELECT id, object_id, slot, type FROM character_quickbar WHERE character_quickbar.character_id = ?`, [id]);
    character.quickbar = quickbar;*/

    return Char;
  }

  async Update ( Character: Character ) {
    console.log("Update character", Character);
    const result = await this.db.Query(`UPDATE characters SET x = ?, y = ?, area = ? WHERE id = ?`, [ Character.x, Character.y, Character.id ]);
    console.log(result);
  }

}
