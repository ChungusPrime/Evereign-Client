const Classes = [
  {
    name: "Soldier",
    description: `Soldiers are relentless warriors, they use their exceptional conditioning and prowess in melee combat to take on foes toe-to-toe.\n
      Soldiers are known for their ability to withstand incredible amounts of damage and to fight on even when others would falter.\n
      Subclasses:\n
      Praetorian (Melee, Tank)\n
      Spellblade (Melee, Physical Damage, Magic Damage)\n
      Champion (Melee, Physical Damage)`,
    starting_description: `Resource: Adrenaline\n
      Starting Abilities:\n
      Light Armour Proficiency\n
      Medium Armour Proficiency\n
      Sword Proficiency\n
      \n
      Starting Equipment:\n
      Rusty Chailmail\n
      Longsword\n
      2x Food\n
      3x Healing Potions`,
  },

  {
    name: "Godsworn",
    description: `The Godsworn is a divine warrior, drawing upon the powers granted by the gods to fuel their combat abilities and support their allies.\n
      They wield holy magic to heal and protect their comrades, and smite their enemies with divine wrath.\n
      Subclasses:\n
      Forsaken (Melee, Tank)\n
      Mender (Melee, Healer)\n
      Ascended (Melee, Physical/Magic Damage)`,
    starting_description: `Resource: Divine Power\n
      Starting Abilities:\n
      Light Armour Proficiency\n
      Medium Armour Proficiency\n
      Shield Proficiency\n
      Mace Proficiency\n
      \n
      Starting Equipment:\n
      Splint Mail\n
      Shield
      Mace\n
      2x Food\n
      2x Healing Scrolls\n
      Divine Focus`,
  },

  {
    name: "Operative",
    description: `The Operative is a master of stealth and subterfuge, skilled at striking from the shadows or taking down targets up close with poisons.\n
      They can approach their foes unseen and dispatch them with swift and deadly precision.\n
      Subclasses:\n
      Marksman (Ranged, Physical Damage)\n
      Agent (Melee, Physical Damage, Poison)\n
      Physician (Ranged, Healer)`,
    starting_description: `Resource: Momentum\n
      Starting Abilities:\n
      Light Armour Proficiency\n
      Dagger Proficiency\n
      Bow Proficiency\n
      \n
      Starting Equipment:\n
      Leather Armour\n
      Dagger\n
      Shortbow\n
      50x Makeshift Arrows\
      2x Food\n
      2x Healing Potions`,
  },

  {
    name: "Arcanist",
    description: `The Arcanist is a mage who draws upon the powers of light and life to dispatch their foes.\n 
      They can summon elemental forces and manipulate the energies of life and nature to protect their allies and harm their enemies.\n
      Subclasses:\n
      Lifebringer (Ranged, Healer)\n
      Elementalist (Ranged, Magic Damage)\n
      Battlemage (Melee, Physical Damage, Magic Damage)`,
    starting_description: `Resource: Mana\n`,
  },

  {
    name: "Harbinger",
    description: `The Harbinger is a dark mage who uses the powers of necromancy and blood magic to bring ruin to their foes.\n
      They can summon the spirits of the dead and harness psychic forces to manipulate the battlefield.\n
      Subclasses:\n
      Corruptor (Ranged, Magic Damage)\n
      Deathless (Ranged, Healer)\n
      Siphoner (Melee, Magic Damage)`,
    starting_description: `Resource: Peril\n`,
  },
];

module.exports = Classes;
