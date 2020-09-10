import { Direction } from "./Direction";
import { ResourceCode } from "~data/resources";
import { JobTypeCode } from "~data/jobTypes";
import { ColonistStatusCode } from "~data/colonistStatuses";

export interface Pos {
  x: number;
  y: number;
}
export interface HasPos {
  pos: Pos;
}

export interface Display {
  tile: string | string[];
  rotation?: number;
  color: string;
  priority: number;
  hasBackground?: boolean;
}
export interface HasDisplay {
  display: Display;
}

export interface AnimationToggle {
  conditions: ConditionName[];
}
export interface HasAnimationToggle {
  animationToggle: AnimationToggle;
}

export interface ColorToggle {
  conditions: ConditionName[];
  trueColor: string;
  falseColor: string;
}
export interface HasColorToggle {
  colorToggle: ColorToggle;
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
    resource: ResourceCode;
    amount: number;
  };
  validitySelector?: string;
}
export interface HasPlacing {
  placing: Placing;
}

export interface Colonist {
  residence: string | null;
  employment: string | null;
  status: ColonistStatusCode;
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
  type: "horizontal" | "vertical" | "advanced";
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
  resource: ResourceCode;
  amount: number;
  conditions: ConditionName[];
  resourceChangeReason: string;
}
export interface HasProduction {
  production: Production;
}

export interface Mineable {
  resource: ResourceCode;
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

export interface RemovingMarker {}
export interface HasRemovingMarker {
  removingMarker: RemovingMarker;
}

export interface Description {
  name: string;
  description: string;
}
export interface HasDescription {
  description: Description;
}

export interface JobProvider {
  consumes: Partial<Record<ResourceCode, number>>;
  produces: Partial<Record<ResourceCode, number>>;
  numberEmployed: number;
  maxNumberEmployed: number;
  jobType: JobTypeCode;
  resourceChangeReason: string;
}
export interface HasJobProvider {
  jobProvider: JobProvider;
}

export interface Powered {
  hasPower: boolean;
  powerNeeded: number;
  resourceChangeReason: string;
}

export interface HasPowered {
  powered: Powered;
}

export interface Building {}
export interface HasBuilding {
  building: Building;
}

export interface JobDisabler {}
export interface HasJobDisabler {
  jobDisabler: JobDisabler;
}

export interface DisableMarker {}
export interface HasDisableMarker {
  disableMarker: DisableMarker;
}

export interface SmokeEmitter {
  emitters: {
    offset: Pos;
    conditions: ConditionName[];
  }[];
}
export interface HasSmokeEmitter {
  smokeEmitter: SmokeEmitter;
}

export interface Cursor {}
export interface HasCursor {
  cursor: Cursor;
}

export interface Border {}
export interface HasBorder {
  border: Border;
}

export interface Entity
  extends Partial<HasAI>,
    Partial<HasBlocking>,
    Partial<HasBorder>,
    Partial<HasBuilding>,
    Partial<HasColonist>,
    Partial<HasColorToggle>,
    Partial<HasCursor>,
    Partial<HasAnimationToggle>,
    Partial<HasConductive>,
    Partial<HasDescription>,
    Partial<HasDestructible>,
    Partial<HasDisableMarker>,
    Partial<HasDisplay>,
    Partial<HasHousing>,
    Partial<HasInspector>,
    Partial<HasJobDisabler>,
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
    Partial<HasRemovingMarker>,
    Partial<HasRotatable>,
    Partial<HasSmokeEmitter>,
    Partial<HasSplitter>,
    Partial<HasStairs>,
    Partial<HasValidMarker> {
  id: string;
  parentTemplate?: TemplateName;
  template: TemplateName;
}

export type EntityHasPos = Entity & HasPos;
