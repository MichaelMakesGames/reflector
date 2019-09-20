import { Entity } from "./Entity";

export interface GameState {
  entities: {
    [id: string]: Entity;
  };
  entitiesByPosition: {
    [position: string]: string[];
  };
  messageLog: string[];
  gameOver: boolean;
  turnsUntilNextImmigrant: number;
}
