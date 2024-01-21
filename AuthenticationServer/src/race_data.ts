const Races = [
  
  {
    name: "Human",
    background: `Humans are a versatile and ambitious race known for their adaptability and diversity. They hail from various regions, each with its unique cultures, traditions, and histories.\n
    Humans have a rich history of exploration, trade, and conflict. Their kingdoms rise and fall, leaving a tapestry of tales and legends that shape the world.`,
    racial_bonuses: [
      `+1 Strength`,
      `+1 Personality`,
      `+1 Willpower`,
      `+1 Agility`,
      `+1 Intelligence`,
      `Ability: Forestry Efficiency (Increased gathering yield, reduced gathering time)`,
      `Ability: Mercantile Efficiency (Reduced market tax, decreased buying and increased selling prices)`,
    ]
  },

  {
    name: "Dwarf",
    background: `Dwarves are stout, resilient beings with a deep connection to the earth. They are master craftsmen and skilled miners, often living in vast underground cities.\n
    Dwarves have a strong sense of honor and tradition. They are known for their skill in metallurgy and the creation of intricate, durable weapons and armor.`,
    racial_bonuses: [
      `+2 Strength`,
      `+2 Wisdom`,
      `+1 Endurance`,
      `Ability: Mining Efficiency (Increased gathering yield, reduced gathering time)`,
      `Ability: Armoursmithing Efficiency (Reduced material cost, reduced crafting time)`,
    ]
  },

  {
    name: "Elf",
    background: `Elves are elegant and ethereal beings with pointed ears and a natural affinity for magic. They are often attuned to nature, residing in ancient forests or secluded realms.\n
    Elves possess a deep connection with the mystical forces of the world. Their societies are steeped in ancient lore, and some elves are known for their mastery of arcane arts.`,
    racial_bonuses: [
      `+2 Agility`,
      `+2 Intelligence`,
      `+1 Personality`,
      `Ability: Leatherworking Efficiency (Increased gathering yield, reduced gathering time)`,
      `Ability: Enchanting Efficiency (Reduced material cost, reduced crafting time)`,
    ]
  },

  {
    name: "Gnome",
    background: `Gnomes are small, clever beings with a penchant for invention and curiosity. They often dwell in hidden, technology-driven cities.\n
    Gnomes are inventors and tinkerers, creating marvels of machinery and magical gadgets. Their playful nature is balanced by an insatiable thirst for knowledge.`,
    racial_bonuses: [
      `+2 Intelligence`,
      `+2 Willpower`,
      `+1 Agility`,
      `Ability: Salvaging Efficiency (Increased gathering yield, reduced gathering time)`,
      `Ability: Engineering Efficiency (Reduced material cost, reduced crafting time)`,
    ]
  },

  {
    name: "Half-Orc",
    description: `Half-Orcs are a robust and formidable mix of human and orc ancestry, combining strength and endurance. They often find themselves straddling the line between two worlds.\n
    Half-Orcs face prejudice due to their mixed heritage. Many strive to prove themselves through feats of strength, valor, and loyalty.`,
    racial_bonuses: [
      `+3 Strength`,
      `+2 Endurance`,
      `Ability: Woodworking Efficiency (Increased gathering yield, reduced gathering time)`,
      `Ability: Weaponsmithing Efficiency (Reduced material cost, reduced crafting time)`,
    ]
  },

  {
    name: "Undead",
    background: `Reanimated skeletons or other undead beings, animated by dark magic or cursed rituals. Though the art of Necromancy was previously banned entirely, certain rituals are now allowed with Royal permission.\n
    The Undead are often remnants of ancient civilizations or victims of powerful necromantic spells. Some seek redemption, while others succumb to malevolent forces.`,
    racial_bonuses: [
      `+2 Strength`,
      `+1 Agility`,
      `+2 Willpower`,
      `Ability: '' Efficiency (Increased gathering yield, reduced gathering time)`,
      `Ability: '' Efficiency (Reduced material cost, reduced crafting time)`,
    ]
  },

  {
    name: "Kirupean",
    background: `Cat-like beings with keen senses and agility. They often have a mysterious air and are skilled in stealth and perception.\n
    Kirupeans have a deep connection to the natural world, and their societies are often nomadic or hidden in the shadows. They value independence and freedom.`,
    racial_bonuses: [
      `+2 Willpower`,
      `+3 Agility`,
      `Ability: Lockpicking Efficiency (Increased gathering yield, reduced gathering time)`,
      `Ability: Tailoring Efficiency (Reduced material cost, reduced crafting time)`,
    ]
  },

  {
    name: "Thogac",
    background: `Lizard-like beings known for their affinity with water and marshy environments. They often have scales and tails, and some possess unique abilities related to aquatic life.\n
    Thogac have a complex social structure and are skilled hunters and gatherers. Their cultural rituals often involve communion with the spirits of the water.`,
    racial_bonuses: [
      `+3 Endurance`,
      `+2 Agility`,
      `Ability: Herbalism Efficiency (Increased gathering yield, reduced gathering time)`,
      `Ability: Medicine Efficiency (Reduced material cost, reduced crafting time)`,
    ]
  },

  {
    name: "Avenite",
    background: `Avian humanoids with feathers and beaks, resembling ravens or crows. They have a natural affinity for flight and are often associated with mystery and intelligence.\n
    Avenite are known for their keen intellect and mystical abilities. They often live in mountainous regions, overseeing vast territories with a watchful eye.`,
    racial_bonuses: [
      `+2 Intelligence`,
      `+2 Wisdom`,
      `+1 Agility`,
      `Ability: Fishing Efficiency (Increased gathering yield, reduced gathering time)`,
      `Ability: Alchemy Efficiency (Reduced material cost, reduced crafting time)`,
    ]
  },

  {
    name: "Automaton",
    background: `Mechanical beings created by ancient civilizations, resembling humanoid figures but made of gears, metal, and magic.\n
    Automatons were crafted for various purposes, from guardians to servants. Some seek to understand their origins, while others serve as protectors of ancient secrets.`,
    racial_bonuses: [
      `3x Modular upgrade ports`,
    ]
  },

  {
    name: "Tiseri",
    background: `Fiery beings with red skin, horns, and tails, resembling devils from another realm. They often wield dark magic and are known for their cunning nature.\n
    Tiseri hail from a realm infused with dark energies. They are often misunderstood due to their infernal appearance, but many possess a complex moral compass and seek redemption.`,
    racial_bonuses: [
      `+1 Strength`,
      `+2 Personality`,
      `+1 Agility`,
      `+1 Willpower`,
    ]
  },

  {
    name: "Drakonid",
    background: `Dragon-like beings with scales, claws, and sometimes wings. They have a natural connection to elemental forces and often possess a breath weapon.\n
    Drakonid are descendants of dragons or beings blessed by draconic powers. They have a proud heritage and often serve as protectors of ancient dragon lore.`,
    racial_bonuses: [
      `+2 Strength`,
      `+2 Intelligence`,
      `+2 Endurance`,
    ]
  },

];

export default Races;
