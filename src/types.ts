import { ActionType, getType } from "typesafe-actions";
import * as actions from "./redux/actions";
import { RED, WHITE, GREEN } from "./constants";

export type Action = ActionType<typeof actions>;

export type Color = typeof WHITE | typeof RED | typeof GREEN;

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
  color: Color;
}

export type AIType = "RUSHER" | "ANGLER" | "SMASHER" | "BOMBER";
export interface AI extends Component {
  type: AIType;
}

export interface Blocking extends Component {}

export interface Targeting extends Component {}

export interface Destructible extends Component {}

export interface HitPoints extends Component {
  current: number;
  max: number;
}

export interface Throwing extends Component {
  range: number;
}

export interface PickUp extends Component {
  effect: "NONE" | "HEAL" | "RECHARGE" | "EQUIP";
}

export interface Reflector extends Component {
  type: "\\" | "/";
}

export interface Splitter extends Component {
  type: "horizontal" | "vertical";
}

export interface Weapon extends Component {
  power: number;
  cooldown: number;
  readyIn: number;
  slot: number;
  active: boolean;
}

export interface Entity {
  id: string;
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
}

export interface GameState {
  entities: {
    [id: string]: Entity;
  };
  entitiesByPosition: {
    [position: string]: string[];
  };
}
