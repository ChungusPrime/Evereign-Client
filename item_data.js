const itemData = [

	// Weapons
	{ item_id: "t_sword", type: "weapon", rarity: "common", name: "Tarnished Sword", damageMin: 1, damageMax: 3, levelRequired: 1, value: 1, sprite: 0 },
	{ item_id: "b_dagger", type: "weapon", rarity: "common", name: "Blunt Dagger", damageMin: 1, damageMax: 3, levelRequired: 1, value: 1 },
	{ item_id: "c_axe", type: "weapon", rarity: "common", name: "Cracked Axe", damageMin: 1, damageMax: 3, levelRequired: 1, value: 1 },
	{ item_id: "c_mace", type: "weapon", rarity: "common", name: "Cracked Mace", damageMin: 1, damageMax: 3, levelRequired: 1, value: 1 },

	// Chest
	{ item_id: "dplate_c", type: "armour", slot: "chest", rarity: "common", name: "Dented Breastplate", armour: 5, levelRequired: 1, value: 1, sprite: 8 },

	// Legs
	{ item_id: "dplate_l", type: "leg_armour", rarity: "common", name: "Dented Plate Legs", armour: 4, levelRequired: 1, value: 1 },

	// Hands
	{ item_id: "dplate_h", type: "hand_armour", rarity: "common", name: "Dented Plate Gloves", armour: 2, levelRequired: 1, value: 1 },

	// Feet
	{ item_id: "dplate_b", type: "feet_armour", rarity: "common", name: "Dented Plate Boots", armour: 2, levelRequired: 1, value: 1 },

	//Junk
	{ item_id: "w_bandit_bag", type: "junk", rarity: "common", name: "Bandit Coinpurse", value: 1 },
	{ item_id: "bandit_mask", type: "junk", rarity: "common", name: "Bandit Face Mask", value: 2 },

	// Quest Items
	{ item_id: "bandit_orders", type: "quest", rarity: "rare", name: "Bandit Orders", value: 0 },

];

module.exports = itemData;
