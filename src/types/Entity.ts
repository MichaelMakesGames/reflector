import { Action } from "./Action";

export interface Pos {
  x: number;
  y: number;
}
export interface HasPos {
  pos: Pos;
}

export interface Display {
  tile?: string;
  rotation?: number;
  glyph: string;
  color: string;
  priority: number;
}
export interface HasDisplay {
  display: Display;
}

export type AIType = "DRONE";
export interface AI {
  type: AIType;
}
export interface HasAI {
  ai: AI;
}

export interface Blocking {
  moving: boolean;
  lasers: boolean;
}
export interface HasBlocking {
  blocking: Blocking;
}

export interface Targeting {
  cosmetic?: boolean;
}
export interface HasTargeting {
  targeting: Targeting;
}

export interface Destructible {
  onDestroy?: (entity: Entity) => Action | null;
}
export interface HasDestructible {
  destructible: Destructible;
}

export interface Placing {
  takesTurn: boolean;
  cost?: {
    resource: string;
    amount: number;
  };
}
export interface HasPlacing {
  placing: Placing;
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

export interface ValidMarker {}
export interface HasValidMarker {
  validMarker: ValidMarker;
}

export interface Stairs {}
export interface HasStairs {
  stairs: Stairs;
}

export interface Conductive {}
export interface HasConductive {
  conductive: Conductive;
}

export interface Housing {
  occupancy: number;
  capacity: number;
  desirability: number;
  removeOnVacancy?: boolean;
}
export interface HasHousing {
  housing: Housing;
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

export type Resource = "METAL";
export interface Production {
  resource: Resource;
  amount: number;
}
export interface HasProduction {
  production: Production;
}

export interface Mineable {
  resource: Resource;
}
export interface HasMineable {
  mineable: Mineable;
}

export interface Projector {
  range: number;
}
export interface HasProjector {
  projector: Projector;
}

export interface Inspector {}
export interface HasInspector {
  inspector: Inspector;
}

export interface PlacingMarker {}
export interface HasPlacingMarker {
  placingMarker: PlacingMarker;
}

export interface Description {
  name: string;
  description: string;
}
export interface HasDescription {
  description: Description;
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
    Partial<HasPlacing>,
    Partial<HasValidMarker>,
    Partial<HasStairs>,
    Partial<HasHousing>,
    Partial<HasProduction>,
    Partial<HasMineable>,
    Partial<HasProjector>,
    Partial<HasInspector>,
    Partial<HasDescription>,
    Partial<HasPlacingMarker>,
    Partial<HasConductive> {
  id: string;
  parentTemplate?: string;
}

export type EntityHasPos = Entity & HasPos;
