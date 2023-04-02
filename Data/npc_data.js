var npcData = [

	{ id: 1, name: "Choss Perogen", title: "Alchemist", sprite: 47, x: 1045, y: 1345,
		baseRespawnTime: 10, currentRespawnTime: 10, status: "Alive",
		greeting: "Hi there, fresh wears daily!",
		vendor: true,
		inventory: ["healing_dram", "mana_dram"]
	},

	{ id: 2, name: "Steven Trilobite", title: "Blacksmith", sprite: 33, x: 1276, y: 993,
		baseRespawnTime: 10, currentRespawnTime: 10, status: "Alive",
		greeting: "Best armour in the kingdom, have a look!",
		vendor: true,
		inventory: ["dented_breastplate", "dented_plate_legs", "tarnished_sword", "dented_plate_gloves", "dented_plate_boots"]
	},

	{ id: 3, name: "Milton Albrecht", title: "Port Manager", sprite: 41, x: 567, y: 823,
		baseRespawnTime: 10, currentRespawnTime: 10, status: "Alive",
		quest_giver: true,
		questsAvailable: [1]
	},

	{ id: 4, name: "Port Official", sprite: 34, baseRespawnTime: 10, currentRespawnTime: 10, status: "Alive", x: 672, y: 790 },
	{ id: 5, name: "Port Official", sprite: 26, baseRespawnTime: 10, currentRespawnTime: 10, status: "Alive", x: 706, y: 858 },

	{ id: 6, name: "Bandit Cutthroat", sprite: 0, x: 991, y: 221,
		baseRespawnTime: 10, currentRespawnTime: 10, status: "Alive",
		area: "Opalla Port",
		health: 8,
		level: 1,
		goldMin: 1,
		goldMax: 2,
		drops: ["bandit_mask", "worn_dagger", "bandit_ear"]
	},

	{ id: 7, name: "Bandit Enforcer", sprite: 0, x: 1040, y: 154,
		baseRespawnTime: 10, currentRespawnTime: 10, status: "Alive",
		area: "Opalla Port",
		health: 10,
		level: 1,
		goldMin: 1,
		goldMax: 2,
		drops: ["bandit_mask", "bandit_ear", "cracked_blackjack", "bandit_orders"]
	}

];

module.exports = npcData
