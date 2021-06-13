import { Direction } from "./Direction";
import { ResourceCode } from "~data/resources";
import { JobTypeCode } from "~data/jobTypes";
import { ColonistStatusCode } from "~data/colonistStatuses";
import { SoundOptions } from "~lib/audio/Audio";

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
}

export interface StopsLaser {}

export interface Blocking {
  moving: boolean;
  lasers: boolean;
  windmill: boolean;
}

export interface Laser {
  cosmetic?: boolean;
  strength: number;
  direction: Direction;
  hit: boolean;
}

export interface Destructible {
  onDestroy?: string;
  explosive?: boolean;
}

export interface Colonist {
  residence: string | null;
  employment: string | null;
  status: ColonistStatusCode;
  missingResources: ResourceCode[];
}

export interface Rotatable {
  rotatesTo: TemplateName;
}

export interface Reflector {
  type: "\\" | "/";
}

export interface Splitter {
  type: "horizontal" | "vertical" | "advanced";
}

export interface ValidMarker {}

export interface Housing {
  occupancy: number;
  capacity: number;
  desirability: number;
  removeOnVacancy?: boolean;
}

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
  numberEmployed: number;
  maxNumberEmployed: number;
  jobType: JobTypeCode;
  resourceChangeReason: string;
}

export interface Powered {
  hasPower: boolean;
  powerNeeded: number;
  resourceChangeReason: string;
}

export interface Building {}

export interface Blueprint {
  builds: TemplateName;
  canReplace?: TemplateName[];
  cost: { resource: ResourceCode; amount: number };
  validityConditions: { condition: ConditionName; invalidMessage: string }[];
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

export interface Entity {
  id: string;
  parentTemplate?: TemplateName;
  template: TemplateName;

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
  description?: Description;
  destructible?: Destructible;
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
  reflector?: Reflector;
  rotatable?: Rotatable;
  smokeEmitter?: SmokeEmitter;
  splitter?: Splitter;
  stopsLaser?: StopsLaser;
  validMarker?: ValidMarker;
  warning?: Warning;
}
