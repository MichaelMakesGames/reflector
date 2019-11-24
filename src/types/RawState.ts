import { Entity } from "./Entity";
import { Direction } from "./Direction";

export interface RawState {
  version: string;
  entities: {
    [id: string]: Entity;
  };
  entitiesByPosition: {
    [position: string]: string[];
  };
  messageLog: string[];
  gameOver: boolean;
  victory: boolean;
  turnsUntilNextImmigrant: number;
  morale: number;
  time: TimeState;
  isBuildMenuOpen: boolean;
  resources: {
    [resource: string]: number;
  };
  lastAimingDirection: Direction;
}

export interface TimeState {
  day: number;
  turn: number;
  isNight: boolean;
  turnsUntilChange: number;
  directionWeights: {
    n: number;
    s: number;
    e: number;
    w: number;
  };
}
