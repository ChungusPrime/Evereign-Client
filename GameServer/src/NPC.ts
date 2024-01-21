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
  vendor_items: string;
  available_quests: string;
  loot: string;
  region: string;
  trainer: boolean = false;

  // data set manually
  width: number = 8;
  height: number = 16;

  target: string = null;
  status: string = "Alive";
  moving: boolean = false;
  in_combat: boolean = false;

  body = null;

  spawn_x: number;
  spawn_y: number;
  current_health: number;

  baseAggroRange: number = 50;

  // Time it takes to respawn after death
  maxRespawnTime: number = 10000;
  currentRespawnTime: number = 0;

  // Time it takes to reset after no damage is given or taken
  maxResetTime: number = 6000;
  currentResetTime: number = 0;

  // Time it takes for this npc to attack again
  maxAttackTime: number = 5000;
  currentAttackTime: number = 0;

  constructor ( data: NPC ) {
    Object.assign(this, data);
    this.spawn_x = this.x;
    this.spawn_y = this.y;
    this.current_health = this.max_health;
  }

  UpdatePosition () {
    this.x = this.body.x;
    this.y = this.body.y;
  }

  ChangeTarget ( target: string ) {
    this.target = target;
    this.currentResetTime = 0;
    this.in_combat = true;
    console.log(`${this.id} changed target to socket: ${this.target}`);
  }

  TryRespawn ( delta: number ): Boolean {
    this.currentRespawnTime += delta;
    if ( this.currentRespawnTime >= this.maxRespawnTime ) {
      this.ResetToDefault();
      return true;
    }
    return false;
  }

  TryReset ( delta: number ): Boolean {
    this.currentResetTime += delta;
    if ( this.currentResetTime >= this.maxResetTime ) {
      this.ResetToDefault();
      return true;
    }
    return false;
  }

  ResetToDefault () {
    this.status = "Alive";
    this.currentRespawnTime = 0;
    this.currentResetTime = 0;
    this.moving = false;
    this.current_health = this.max_health;
    this.target = null;
    this.in_combat = false;
    this.body.reset(this.spawn_x, this.spawn_y);
    this.body.x = this.spawn_x;
    this.body.y = this.spawn_y;
    this.UpdatePosition();
  }

  Die () {
    this.status = "Dead";
    this.currentRespawnTime = 0;
    this.currentResetTime = 0;
    this.target = null;
    this.current_health = 0;
    this.moving = false;
    this.in_combat = false;
    this.body.reset(this.body.x, this.body.y);
    this.UpdatePosition();
  }

}
