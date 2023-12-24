export default class Character {

  // data from DB columns
  id: number; 
  player_id: number;
  name: string;
  class: string;
  subclass: string;
  area: string;
  x: number;
  y: number;
  level: number;
  faction: string;
  xp: number;
  inventory: string;
  equipped: string;
  quests: string;
  abilities: string;
  skills: string;
  carry_weight: number;
  strength: number;
  endurance: number;
  agility: number;
  personality: number;
  intelligence: number;
  willpower: number;

  // data set manually
  body: any;
  socket: string;

  constructor ( Character: Character ) {
    Object.assign(this, Character);
  }

}