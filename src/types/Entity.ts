export interface Pos {
  x: number;
  y: number;
}
export interface HasPos {
  pos: Pos;
}

export interface Display {
  tile?: string;
  glyph: string;
  color: string;
  priority: number;
}
export interface HasDisplay {
  display: Display;
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

export interface Throwing {
  range: number;
}
export interface HasThrowing {
  throwing: Throwing;
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

export interface FOV {}
export interface HasFOV {
  fov: FOV;
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
  slot: number;
  active: boolean;
  type: WeaponType;
}
export interface HasWeapon {
  weapon: Weapon;
}

export interface Entity
  extends Partial<HasPos>,
    Partial<HasDisplay>,
    Partial<HasAI>,
    Partial<HasBlocking>,
    Partial<HasWeapon>,
    Partial<HasTargeting>,
    Partial<HasDestructible>,
    Partial<HasReflector>,
    Partial<HasSplitter>,
    Partial<HasThrowing>,
    Partial<HasFOV>,
    Partial<HasStairs>,
    Partial<HasConductive> {
  id: string;
  parentTemplate?: string;
}

export type EntityHasPos = Entity & HasPos;
