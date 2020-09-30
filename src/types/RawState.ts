import { Entity, Pos } from "./Entity";
import { Direction } from "./Direction";
import { ResourceCode } from "~data/resources";
import { JobTypeCode } from "~data/jobTypes";

export interface RawState {
  version: string;
  entities: Record<string, Entity>;
  entitiesByPosition: Record<string, string[]>;
  messageLog: Record<number, { type?: string; message: string }[]>;
  gameOver: boolean;
  victory: boolean;
  turnsUntilNextImmigrant: number;
  morale: number;
  time: TimeState;
  laserState: "READY" | "ACTIVE" | "FIRING" | "RECHARGING";
  resources: Record<ResourceCode, number>;
  resourceChanges: Record<ResourceCode, { reason: string; amount: number }[]>;
  resourceChangesThisTurn: Record<
    ResourceCode,
    { reason: string; amount: number }[]
  >;
  lastAimingDirection: Direction;
  jobPriorities: Record<JobTypeCode, number>;
  cursorPos: Pos | null;
  events: Record<string, number>;

  startOfThisTurn: RawState | null;
  startOfLastTurn: RawState | null;
}

export interface TimeState {
  turn: number;
  directionWeights: {
    n: number;
    s: number;
    e: number;
    w: number;
  };
}
