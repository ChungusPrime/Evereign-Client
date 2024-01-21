"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Character_1 = __importDefault(require("./Character"));
const crypto_1 = __importDefault(require("crypto"));
class CharacterManager {
    constructor(db) {
        this.db = db;
    }
    CreateCharacter(Character, UserID) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(Character, UserID);
            // Add items
            let ItemSQL = "";
            let ItemParams = [];
            if (Character.class == "Gladiator") {
                ItemSQL = "SELECT * FROM data_items WHERE id IN(?)";
                ItemParams = [[13, 14, 15, 16]];
            }
            else if (Character.class == "Godsworn") {
                ItemSQL = "SELECT * FROM data_items WHERE id IN(?)";
                ItemParams = [[13, 14, 15, 16]];
            }
            else if (Character.class == "Operative") {
                ItemSQL = "SELECT * FROM data_items WHERE id IN(?)";
                ItemParams = [[13, 14, 15, 16]];
            }
            else if (Character.class == "Arcanist") {
                ItemSQL = "SELECT * FROM data_items WHERE id IN(?)";
                ItemParams = [[13, 14, 15, 16]];
            }
            else if (Character.class == "Harbinger") {
                ItemSQL = "SELECT * FROM data_items WHERE id IN(?)";
                ItemParams = [[13, 14, 15, 16]];
            }
            else {
                console.log("Invalid class choice");
            }
            let Items = yield this.db.Query(ItemSQL, ItemParams);
            console.log(Items);
            //crypto.randomUUID({ disableEntropyCache: true});
            return;
            const Inventory = JSON.stringify(Items);
            console.log(Inventory);
            const Equipment = JSON.stringify({
                head: {},
                chest: {},
                legs: {},
                hands: {},
                feet: {},
                ring1: {},
                ring2: {},
                ring3: {},
                ring4: {},
                necklace: {},
                trinket: {},
                tool: {},
                ammo: {},
                mainhand: {},
                offhand: {}
            });
            const Attributes = JSON.stringify([
                { attribute: "strength", value: 3 },
                { attribute: "endurance", value: 3 },
                { attribute: "agility", value: 3 },
                { attribute: "personality", value: 3 },
                { attribute: "intelligence", value: 3 },
                { attribute: "willpower", value: 3 }
            ]);
            // Fresh character, no quests
            const Quests = JSON.stringify({});
            // Add abilities based on selected class/race
            /*
            - Light Armour Training\n
            - Medium Armour Training\n
            - Sword Training\n
            */
            const Abilities = JSON.stringify({});
            const DefaultSkillArray = JSON.stringify([
                // Trade Skills
                { name: "Forestry", level: 1, expert: false },
                { name: "Weaponsmithing", level: 1, expert: false },
                { name: "Woodworking", level: 1, expert: false },
                { name: "Armoursmithing", level: 1, expert: false },
                { name: "Leatherworking", level: 1, expert: false },
                { name: "Enchanting", level: 1, expert: false },
                { name: "Tailoring", level: 1, expert: false },
                { name: "Engineering", level: 1, expert: false },
                { name: "Alchemy", level: 1, expert: false },
                { name: "Researching", level: 1, expert: false },
                { name: "Herbalism", level: 1, expert: false },
                { name: "Fishing", level: 1, expert: false },
                { name: "Cooking", level: 1, expert: false },
                { name: "Jewelleler", level: 1, expert: false },
                { name: "Mining", level: 1, expert: false },
                { name: "Salvaging", level: 1, expert: false },
                { name: "Medicine", level: 1, expert: false },
                { name: "Mercantile", level: 1, expert: false },
                { name: "Lockpicking", level: 1, expert: false },
                // Melee
                { name: "Swords", level: 0 },
                { name: "Axes", level: 0 },
                { name: "Maces", level: 0 },
                { name: "Rapiers", level: 0 },
                { name: "Hammers", level: 0 },
                { name: "Morningstars", level: 0 },
                { name: "Spears", level: 0 },
                { name: "Daggers", level: 0 },
                { name: "Flails", level: 0 },
                // Magic
                { name: "Offensive Staffs", level: 0 },
                { name: "Defensive Staffs", level: 0 },
                { name: "Offensive Magic", level: 0 },
                { name: "Defensive Magic", level: 0 },
                // Ranged
                { name: "Guns", level: 0 },
                { name: "Bows", level: 0 },
                { name: "Throwing Weapons", level: 0 },
                { name: "Crossbows", level: 0 },
                // Armour
                { name: "Light Armour", level: 0 },
                { name: "Medium Armour", level: 0 },
                { name: "Heavy Armour", level: 0 },
                { name: "Shields", level: 0 },
                // Defensive
                { name: "Parry", level: 0 },
                { name: "Block", level: 0 },
                { name: "Dodge", level: 0 },
                // Specialist
                { name: "Dual Wielding", level: 0 },
                { name: "Greatweapons", level: 0 },
            ]);
            let Area = "";
            let X = 0;
            let Y = 0;
            if (Character.faction == "Arlamore Kingdom") {
                Area = "D1";
                X = 329;
                Y = 3135;
            }
            else if (Character.faction == "Twilight Accord") {
                Area = "B7";
                X = 1;
                Y = 1;
            }
            let SQL = "INSERT INTO characters VALUES (";
            let Params = [];
            SQL += "id = ?, ";
            Params.push(crypto_1.default.randomUUID({ disableEntropyCache: true }));
            SQL += "player_id = ?, ";
            Params.push(UserID);
            SQL += "name = ?, ";
            Params.push(Character.name);
            SQL += "race = ?, ";
            Params.push(Character.race);
            SQL += "class = ?, ";
            Params.push(Character.class);
            SQL += "subclass = ?, ";
            Params.push(Character.subclass);
            SQL += "area = ?, ";
            Params.push(Area);
            SQL += "x = ?, ";
            Params.push(X);
            SQL += "y = ?, ";
            Params.push(Y);
            SQL += "level = ?, ";
            Params.push(1);
            SQL += "faction = ?, ";
            Params.push(Character.faction);
            SQL += "xp = ?, ";
            Params.push(0);
            SQL += "inventory = ?, ";
            Params.push(Inventory);
            SQL += "equipment = ?, ";
            Params.push(Equipment);
            SQL += "quests = ?, ";
            Params.push(Quests);
            SQL += "abilities = ?, ";
            Params.push(Abilities);
            SQL += "skills = ?, ";
            Params.push(DefaultSkillArray);
            SQL += "carry_weight = ?, ";
            Params.push(50);
            SQL += "attributes = ?, ";
            Params.push(Attributes);
            SQL += "sprite = ?";
            Params.push(1);
            SQL += ")";
            try {
                const [Result] = yield this.db.Query(SQL, Params);
                console.log(Result);
                return Result;
            }
            catch (error) {
                console.log(error);
                return error;
            }
        });
    }
    GetAccountList(PlayerID) {
        return __awaiter(this, void 0, void 0, function* () {
            const [Characters] = yield this.db.Query("SELECT id, name, level FROM characters WHERE characters.player_id = ?", [PlayerID]);
            return Characters;
        });
    }
    GetCharacter(CharacterID, PlayerID, SocketID) {
        return __awaiter(this, void 0, void 0, function* () {
            const SQL = "SELECT * FROM characters WHERE characters.id = ? AND characters.player_id = ? LIMIT 1";
            const Params = [CharacterID, PlayerID];
            const [Result] = yield this.db.Query(SQL, Params);
            const CharacterInstance = new Character_1.default(Result[0], SocketID);
            return CharacterInstance;
        });
    }
    UpdateCharacter(Character) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Update character", Character);
            const SQL = `UPDATE characters SET x = ?, y = ?, area = ? WHERE id = ?`;
            const Params = [Character.x, Character.y, Character.id];
            const Result = yield this.db.Query(SQL, Params);
            console.log(Result);
        });
    }
}
exports.default = CharacterManager;
