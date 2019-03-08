import { ActionType, getType } from "typesafe-actions";
import * as actions from "./actions";
import {
  RED,
  WHITE,
  GREEN,
  BLUE,
  GRAY,
  TRANSPARENT,
  BLACK,
  YELLOW,
  PURPLE,
} from "./constants";
import { number } from "prop-types";

export type Action = ActionType<typeof actions>;

export interface Direction {
  dx: number;
  dy: number;
}
export interface Component {}

export interface Position extends Component {
  x: number;
  y: number;
}

export interface Glyph extends Component {
  glyph: string;
  color: string;
  background?: string;
  priority: number;
}

export type AIType = "RUSHER" | "ANGLER" | "SMASHER" | "BOMBER";
export interface AI extends Component {
  type: AIType;
}

export interface Blocking extends Component {
  moving: boolean;
  throwing: boolean;
}

export interface Targeting extends Component {}

export interface Destructible extends Component {}

export interface HitPoints extends Component {
  current: number;
  max: number;
}

export interface Throwing extends Component {
  range: number;
}

export interface Equipping extends Component {}

export interface PickUp extends Component {
  effect: "NONE" | "HEAL" | "RECHARGE" | "EQUIP" | "PICKUP";
}

export interface Reflector extends Component {
  type: "\\" | "/";
}

export interface Splitter extends Component {
  type: "horizontal" | "vertical";
}

export interface Cooldown extends Component {
  time: number;
}
export interface Bomb extends Component {
  time: number;
}

export interface Inventory extends Component {
  reflectors: number;
  splitters: number;
}

export interface FOV extends Component {}

export interface Level extends Component {
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

export interface Stairs extends Component {}

export interface Conductive extends Component {}

export type WeaponType =
  | "LASER"
  | "EXPLOSIVE"
  | "TELEPORT"
  | "ELECTRIC"
  | "STASIS"
  | "OMEGA";
export interface Weapon extends Component {
  name: string;
  power: number;
  cooldown: number;
  readyIn: number;
  slot: number;
  active: boolean;
  type: WeaponType;
}

interface Factory extends Component {
  type: string;
  cooldown: number;
}

export interface Entity {
  id: string;
  parentTemplate?: string;
  position?: Position;
  glyph?: Glyph;
  ai?: AI;
  blocking?: Blocking;
  weapon?: Weapon;
  targeting?: Targeting;
  destructible?: Destructible;
  reflector?: Reflector;
  splitter?: Splitter;
  hitPoints?: HitPoints;
  throwing?: Throwing;
  pickup?: PickUp;
  bomb?: Bomb;
  inventory?: Inventory;
  fov?: FOV;
  cooldown?: Cooldown;
  level?: Level;
  stairs?: Stairs;
  conductive?: Conductive;
  equipping?: Equipping;
  factory?: Factory;
}

export interface GameState {
  entities: {
    [id: string]: Entity;
  };
  entitiesByPosition: {
    [position: string]: string[];
  };
  messageLog: string[];
  gameOver: boolean;
}
