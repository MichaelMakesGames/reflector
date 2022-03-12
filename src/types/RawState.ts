import type { JobTypeCode } from "../data/jobTypes";
import type { ResourceCode } from "../data/resources";
import type { Direction } from "./Direction";
import type { Entity, Pos } from "./Entity";
import type { TutorialId } from "./TutorialId";

export interface RawState {
  version: string;
  mapType: string;
  entities: Record<string, Entity>;
  entitiesByPosition: Record<string, Set<string>>;
  entitiesByComp: Record<string, Set<string>>;
  messageLog: Record<number, { type?: string; message: string }[]>;
  gameOver: boolean;
  victory: boolean;
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
  isAutoMoving: boolean;
  events: Record<string, number>;
  tutorials: TutorialsState;
  lastMoveWasFast: boolean;
  bordersKey: string | null;
  movementCostCache?: Record<string, number>;
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

export interface TutorialsState {
  completed: TutorialId[];
  active: {
    id: TutorialId;
    step: number;
  }[];
}
