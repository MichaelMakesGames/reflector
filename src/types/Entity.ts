import type { Action } from ".";
import type { ColonistStatusCode } from "../data/colonistStatuses";
import type { JobTypeCode } from "../data/jobTypes";
import type { ResourceCode } from "../data/resources";
import type { SoundOptions } from "../lib/audio/Audio";
import { ConditionName } from "./ConditionName";
import type { Direction } from "./Direction";
import type { Effect } from "./Effect";
import { TemplateName } from "./TemplateName";

export interface Pos {
  x: number;
  y: number;
}

export interface Display {
  tile: string | string[];
  rotation?: number;
  speed?: number;
  color: string;
  priority: number;
  hasBackground?: boolean;
  flashWhenVisible?: boolean;
  discreteMovement?: boolean;
  offsetX?: number;
  offsetY?: number;
  height?: number;
  width?: number;
  group?: {
    id: string;
    glow?: {
      color: string;
      baseStrength: number;
      sinMultiplier: number;
      deltaDivisor: number;
      distance?: number;
    };
  };
}

export interface Demo {
  width: number;
  height: number;
  entities: Record<string, [TemplateName, Partial<Entity>]>;
  actions: (Action | number)[];
}

export interface AnimationToggle {
  conditions: ConditionName[];
}

export interface ColorToggle {
  conditions: ConditionName[];
  trueColor: string;
  falseColor: string;
}

export interface AudioToggle {
  soundName: string;
  soundOptions?: SoundOptions;
  conditions: ConditionName[];
}

export type AIType = "DRONE" | "FLYER" | "BURROWER" | "BURROWED";
export interface AI {
  type: AIType;
  target: Pos | null;
  plannedAction: "MOVE_OR_ATTACK" | "DIG" | null;
  plannedActionDirection: Direction | null;
  plannedPath?: Pos[] | null;
}

export interface DirectionIndicator {}

export interface StopsLaser {}

export interface Blocking {
  moving: boolean;
  lasers: boolean;
  windmill: boolean;
  building?: boolean;
}

export interface Laser {
  cosmetic?: boolean;
  strength: number;
  direction: Direction;
  hit: boolean;
  source: string;
}

export interface Shield {
  generator: string;
}

export interface ShieldGenerator {
  strength: number;
}

export interface Absorber {
  charged: boolean;
  aimingDirection: Direction | null;
}
export interface Destructible {
  onDestroy?: Effect;
  explosive?: boolean;
  attackPriority?: number;
  movementCost?: number;
}

export interface Colonist {
  residence: string | null;
  employment: string | null;
  status: ColonistStatusCode;
  missingResources: ResourceCode[];
}

export interface Road {}

export interface Rotatable {
  rotatesTo: TemplateName;
}

export interface Reflector {
  type: "\\" | "/";
  outOfRange: boolean;
}

export interface Splitter {
  type: "horizontal" | "vertical" | "advanced";
}

export interface ValidMarker {}

export interface Housing {
  occupancy: number;
  capacity: number;
}

export interface Windowed {
  windowConditions: { condition: ConditionName; tile: string }[];
}

export interface Window {}

export interface Production {
  resource: ResourceCode;
  amount: number;
  producedLastTurn?: boolean;
  conditions: ConditionName[];
  resourceChangeReason: string;
}

export interface Mineable {
  resource: ResourceCode;
}

export interface Projector {
  condition: ConditionName | null;
  range: number;
}

export interface Description {
  name: string;
  description: string;
  shortDescription?: string;
}

export interface JobProvider {
  consumes: Partial<Record<ResourceCode, number>>;
  produces: Partial<Record<ResourceCode, number>>;
  workContributed: number;
  workRequired: number;
  numberEmployed: number;
  maxNumberEmployed: number;
  jobType: JobTypeCode;
  resourceChangeReason: string;
  onWorked?: Effect;
}

export interface Powered {
  hasPower: boolean;
  powerNeeded: number;
  resourceChangeReason: string;
}

export interface Temperature {
  status: "normal" | "hot" | "very hot" | "critical";
  onOverheat: Effect;
}

export interface Building {
  noRubble?: boolean;
  rubbleBlueprint?: TemplateName;
}

export interface Rebuildable {
  blueprint: TemplateName;
}

export interface Blueprint {
  builds: TemplateName;
  canReplace?: TemplateName[];
  cost: { resource: ResourceCode; amount: number };
  validityConditions: { condition: ConditionName; invalidMessage: string }[];
  onBuild?: Effect;
  showBorders?: boolean;
}

export interface JobDisabler {}

export interface SmokeEmitter {
  emitters: {
    offset: Pos;
    conditions: ConditionName[];
  }[];
}

export interface Cursor {}

export interface Highlight {}

export interface MissingResourceIndicator {}

export interface Border {}

export interface PathPreview {
  index: number;
}

export interface Warning {
  text: string;
}

export interface Storage {
  resources: Partial<Record<ResourceCode, number>>;
}

export interface Entity {
  id: string;
  parentTemplate?: TemplateName;
  template: TemplateName;

  absorber?: Absorber;
  ai?: AI;
  animationToggle?: AnimationToggle;
  audioToggle?: AudioToggle;
  blocking?: Blocking;
  blueprint?: Blueprint;
  border?: Border;
  building?: Building;
  colonist?: Colonist;
  colorToggle?: ColorToggle;
  cursor?: Cursor;
  demo?: Demo;
  description?: Description;
  destructible?: Destructible;
  directionIndicator?: DirectionIndicator;
  display?: Display;
  highlight?: Highlight;
  housing?: Housing;
  jobDisabler?: JobDisabler;
  jobProvider?: JobProvider;
  laser?: Laser;
  mineable?: Mineable;
  missingResourceIndicator?: MissingResourceIndicator;
  pathPreview?: PathPreview;
  pos?: Pos;
  powered?: Powered;
  production?: Production;
  projector?: Projector;
  rebuildable?: Rebuildable;
  reflector?: Reflector;
  road?: Road;
  rotatable?: Rotatable;
  shield?: Shield;
  shieldGenerator?: ShieldGenerator;
  smokeEmitter?: SmokeEmitter;
  splitter?: Splitter;
  stopsLaser?: StopsLaser;
  storage?: Storage;
  temperature?: Temperature;
  validMarker?: ValidMarker;
  warning?: Warning;
  window?: Window;
  windowed?: Windowed;
}
