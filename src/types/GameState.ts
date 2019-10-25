import { Entity } from "./Entity";
import { Direction } from "./Direction";

export interface GameState {
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
  wave: WaveState;
  isBuildMenuOpen: boolean;
  resources: {
    [resource: string]: number;
  };
}

export interface WaveState {
  turnsUntilNextWaveStart: number;
  turnsUntilCurrentWaveEnd: number;
  direction: Direction;
}
