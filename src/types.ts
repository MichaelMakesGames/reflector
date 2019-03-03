import { ActionType, getType } from "typesafe-actions";
import * as actions from "./redux/actions";
import { RED, WHITE } from "./constants";

export type Action = ActionType<typeof actions>;
export type PlayerAction =
  | ReturnType<typeof actions.move>
  | ReturnType<typeof actions.fireWeaponSuccess>;
export const playerActions = [actions.move, actions.fireWeaponSuccess].map(
  creator => getType(creator)
);

export type Color = typeof WHITE | typeof RED;

export interface Component {}

export interface Position extends Component {
  x: number;
  y: number;
}

export interface Glyph extends Component {
  glyph: string;
  color: Color;
}

export interface Actor extends Component {
  ready: boolean;
}

export interface AI extends Component {}

export interface Blocking extends Component {}

export interface Targeting extends Component {}

export interface Destructible extends Component {}

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
  actor?: Actor;
  ai?: AI;
  blocking?: Blocking;
  weapon?: Weapon;
  targeting?: Targeting;
  destructible?: Destructible;
  reflector?: Reflector;
  splitter?: Splitter;
}

export interface GameState {
  entities: {
    [id: string]: Entity;
  };
}
