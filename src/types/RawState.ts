import { Entity, Pos } from "./Entity";
import { Direction } from "./Direction";
import { ResourceCode } from "~data/resources";

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
  isWeaponActive: boolean;
  resources: Record<ResourceCode, number>;
  resourceChanges: Record<ResourceCode, { reason: string; amount: number }[]>;
  resourceChangesThisTurn: Record<
    ResourceCode,
    { reason: string; amount: number }[]
  >;
  lastAimingDirection: Direction;
  jobPriorities: Record<JobType, number>;
  cursorPos: Pos | null;
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
