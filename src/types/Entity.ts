import { Direction } from "./Direction";

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

export interface Laser {
  cosmetic?: boolean;
  strength: number;
  direction: Direction;
  hit: boolean;
}
export interface HasLaser {
  laser: Laser;
}

export interface Destructible {
  onDestroy?: string;
}
export interface HasDestructible {
  destructible: Destructible;
}

export interface Placing {
  takesTurn: boolean;
  cost?: {
    resource: Resource;
    amount: number;
  };
}
export interface HasPlacing {
  placing: Placing;
}

export interface Colonist {
  residence: string | null;
  employment: string | null;
}
export interface HasColonist {
  colonist: Colonist;
}

export interface Rotatable {
  rotatesTo: TemplateName;
}
export interface HasRotatable {
  rotatable: Rotatable;
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
  condition: ConditionName | null;
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

export interface JobProvider {
  consumes: Partial<Record<Resource, number>>;
  produces: Partial<Record<Resource, number>>;
  numberEmployed: number;
  maxNumberEmployed: number;
}
export interface HasJobProvider {
  jobProvider: JobProvider;
}

export interface Powered {
  hasPower: boolean;
  powerNeeded: number;
}

export interface HasPowered {
  powered: Powered;
}

export interface Entity
  extends Partial<HasAI>,
    Partial<HasBlocking>,
    Partial<HasColonist>,
    Partial<HasConductive>,
    Partial<HasDescription>,
    Partial<HasDestructible>,
    Partial<HasDisplay>,
    Partial<HasHousing>,
    Partial<HasInspector>,
    Partial<HasJobProvider>,
    Partial<HasLaser>,
    Partial<HasMineable>,
    Partial<HasPlacing>,
    Partial<HasPlacingMarker>,
    Partial<HasPos>,
    Partial<HasPowered>,
    Partial<HasProduction>,
    Partial<HasProjector>,
    Partial<HasReflector>,
    Partial<HasRotatable>,
    Partial<HasSplitter>,
    Partial<HasStairs>,
    Partial<HasValidMarker> {
  id: string;
  parentTemplate?: TemplateName;
  template: TemplateName;
}

export type EntityHasPos = Entity & HasPos;
