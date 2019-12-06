import { Entity } from "./Entity";
import { Direction } from "./Direction";

export interface RawState {
  version: string;
  entities: Record<string, Entity>;
  entitiesByPosition: Record<string, string[]>;
  messageLog: string[];
  gameOver: boolean;
  victory: boolean;
  turnsUntilNextImmigrant: number;
  morale: number;
  time: TimeState;
  isBuildMenuOpen: boolean;
  isWeaponActive: boolean;
  resources: Record<Resource, number>;
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
