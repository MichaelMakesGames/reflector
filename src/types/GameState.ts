import { Entity } from "./Entity";
import { Direction } from "./Direction";

export interface GameState {
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
}

export interface WaveState {
  turnsUntilNextWaveStart: number;
  turnsUntilCurrentWaveEnd: number;
  direction: Direction;
}
