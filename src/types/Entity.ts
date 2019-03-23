export interface Pos {
  x: number;
  y: number;
}
export interface HasPos {
  pos: Pos;
}

export interface Glyph {
  glyph: string;
  color: string;
  background?: string;
  priority: number;
}
export interface HasGlyph {
  glyph: Glyph;
}

export type AIType = "RUSHER" | "ANGLER" | "SMASHER" | "BOMBER";
export interface AI {
  type: AIType;
}
export interface HasAI {
  ai: AI;
}

export interface Blocking {
  moving: boolean;
  throwing: boolean;
}
export interface HasBlocking {
  blocking: Blocking;
}

export interface Targeting {}
export interface HasTargeting {
  targeting: Targeting;
}

export interface Destructible {}
export interface HasDestructible {
  destructible: Destructible;
}

export interface HitPoints {
  current: number;
  max: number;
}
export interface HasHitPoints {
  hitPoints: HitPoints;
}

export interface Throwing {
  range: number;
}
export interface HasThrowing {
  throwing: Throwing;
}

export interface Equipping {}
export interface HasEquipping {
  equipping: Equipping;
}

export interface PickUp {
  effect: "NONE" | "HEAL" | "RECHARGE" | "EQUIP" | "PICKUP";
}
export interface HasPickUp {
  pickup: PickUp;
}

export interface Reflector {
  type: "\\" | "/";
}
export interface HasReflector {
  reflector: Reflector;
}

export interface Splitter {
  type: "horizontal" | "vertical";
}
export interface HasSplitter {
  splitter: Splitter;
}

export interface Cooldown {
  time: number;
}
export interface HasCooldown {
  cooldown: Cooldown;
}

export interface Bomb {
  time: number;
}
export interface HasBomb {
  bomb: Bomb;
}

export interface Inventory {
  reflectors: number;
  splitters: number;
}
export interface HasInventory {
  inventory: Inventory;
}

export interface FOV {}
export interface HasFOV {
  fov: FOV;
}

export interface Level {
  depth: number;
  seed: number;
  current: boolean;
  final: boolean;
  numEnemies: number;
  numReflectors: number;
  numSplitters: number;
  numPickups: number;
  aiWeights: { [type: string]: number };
  possibleWeapons: string[];
}
export interface HasLevel {
  level: Level;
}

export interface Stairs {}
export interface HasStairs {
  stairs: Stairs;
}

export interface Conductive {}
export interface HasConductive {
  conductive: Conductive;
}

export type WeaponType =
  | "LASER"
  | "EXPLOSIVE"
  | "TELEPORT"
  | "ELECTRIC"
  | "STASIS"
  | "OMEGA";
export interface Weapon {
  name: string;
  power: number;
  cooldown: number;
  readyIn: number;
  slot: number;
  active: boolean;
  type: WeaponType;
}
export interface HasWeapon {
  weapon: Weapon;
}

export interface Factory {
  type: string;
  cooldown: number;
}
export interface HasFactory {
  factory: Factory;
}

export interface Teleporter {}
export interface HasTeleporter {
  teleporter: Teleporter;
}

export interface Entity
  extends Partial<HasPos>,
    Partial<HasGlyph>,
    Partial<HasAI>,
    Partial<HasBlocking>,
    Partial<HasWeapon>,
    Partial<HasTargeting>,
    Partial<HasDestructible>,
    Partial<HasReflector>,
    Partial<HasSplitter>,
    Partial<HasHitPoints>,
    Partial<HasThrowing>,
    Partial<HasPickUp>,
    Partial<HasBomb>,
    Partial<HasInventory>,
    Partial<HasFOV>,
    Partial<HasCooldown>,
    Partial<HasLevel>,
    Partial<HasStairs>,
    Partial<HasConductive>,
    Partial<HasEquipping>,
    Partial<HasFactory>,
    Partial<HasTeleporter> {
  id: string;
  parentTemplate?: string;
}

export type EntityHasPos = Entity & HasPos;
