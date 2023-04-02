const abilityData = [

  { id: 1, class: "Gladiator", name: "Strike", description: "Attack the target for 4 damage", use: "Active", cooldown: 10, range: 50, levelRequired: 1, sprite: 0, spritesheet: "skills_b" },
  { id: 2, class: "Gladiator", name: "Sweep", description: "Attack the target, and another within 5 feet for 5 damage", use: "Active", cooldown: 12, range: 50, levelRequired: 2, sprite: 1, spritesheet: "skills_b" },
  { id: 3, class: "Gladiator", name: "Charge", description: "Charge towards the target, dealing 3 damage when in range", use: "Active", cooldown: 15, range: 50, levelRequired: 3, sprite: 2, spritesheet: "skills_b" },
  { id: 4, class: "Gladiator", name: "Battle Lust", description: "Increase damage dealt by 2", use: "Active", cooldown: 60, range: 0, levelRequired: 4, sprite: 3, spritesheet: "skills_b" },

  { id: 5, class: "Any", name: "Sword Proficiency", description: "Give a 5% damage increase when using one-handed and two-handed swords", use: "Passive", levelRequired: 1, sprite: 0 },
  { id: 6, class: "Any", name: "Sword Specialisation", description: "Give a 15% damage increase when using one-handed and two-handed swords", use: "Passive", levelRequired: 5, sprite: 0 },
  { id: 7, class: "Any", name: "Sword Expertise", description: "Give a 15% damage increase when using one-handed and two-handed swords", use: "Passive", levelRequired: 10, sprite: 0 },

  { id: 8, class: "Any", name: "Cloth Armour Proficiency", description: "Allows you to wear Cloth armour", use: "Passive", levelRequired: 1, sprite: 0 },
  { id: 9, class: "Any", name: "Leather Armour Proficiency", description: "Allows you to wear Leather armour", use: "Passive", levelRequired: 1, sprite: 0 },
  { id: 10, class: "Any", name: "Mail Armour Proficiency", description: "Allows you to wear Mail armour", use: "Passive", levelRequired: 1, sprite: 0 },
  { id: 11, class: "Any", name: "Plate Armour Proficiency", description: "Allows you to wear Plate armour", use: "Passive", levelRequired: 1, sprite: 0 },
  { id: 12, class: "Any", name: "Shield Proficiency", description: "Allows you to use shields", use: "Passive", levelRequired: 1, sprite: 0 },

];

module.exports = abilityData
