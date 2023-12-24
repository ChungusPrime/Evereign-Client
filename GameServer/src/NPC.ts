export default class NPC {

  // data from DB columns
  id: number;
  name: string;
  title: string;
  class: string;
  faction: string;
  max_health: number;
  sprite: number;
  x: number;
  y: number;
  speed: number;
  vendor_items: Array<number>;
  available_quests: Array<number>;
  loot: Array<number>;
  area: string;

  // data set manually
  spawn_x: number;
  spawn_y: number;
  current_health: number;
  width: number = 8;
  height: number = 16;
  target: string = null;
  status: string = "Alive";
  moving: boolean = false;
  body = null;

  constructor ( data: NPC ) {
    Object.assign(this, data);
    this.spawn_x = this.x;
    this.spawn_y = this.y;
    this.current_health = this.max_health;
  }

}

