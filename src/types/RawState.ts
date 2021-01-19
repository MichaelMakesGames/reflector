import { JobTypeCode } from "~data/jobTypes";
import { ResourceCode } from "~data/resources";
import { Direction } from "./Direction";
import { Entity, Pos } from "./Entity";
import { TutorialId } from "./TutorialId";

export interface RawState {
  version: string;
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
  cursorPos: Pos | null;
  isAutoMoving: boolean;
  events: Record<string, number>;
  tutorials: TutorialsState;

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

export interface TutorialsState {
  completed: TutorialId[];
  active: {
    id: TutorialId;
    step: number;
  }[];
}
