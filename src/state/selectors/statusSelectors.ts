import {
  DAY_START_MINUTES,
  MINUTES_PER_TURN,
  STARTING_MORALE,
  TURNS_PER_DAY,
  TURNS_PER_NIGHT,
  VICTORY_ON_TURN,
} from "~constants";
import { JobTypeCode } from "~data/jobTypes";
import { ResourceCode } from "~data/resources";
import { Pos, RawState } from "~types";
import { getDistance } from "~utils/geometry";
import { entitiesWithComps } from "./entitySelectors";

export function population(state: RawState): number {
  return entitiesWithComps(state, "colonist").length;
}

export function gameOver(state: RawState) {
  return state.gameOver;
}

export function victory(state: RawState) {
  return state.victory;
}

export function morale(state: RawState) {
  return state.morale;
}

export function hasLostMorale(state: RawState) {
  return state.morale < STARTING_MORALE;
}

export function day(state: RawState) {
  return Math.floor(state.time.turn / TURNS_PER_DAY);
}

export function isNight(state: RawState) {
  return turnOfNight(state) > 0 || turnOfDay(state) === 0;
}

export function turn(state: RawState) {
  return state.time.turn;
}

export function turnOfNight(state: RawState) {
  return turnOfDay(state) - (TURNS_PER_DAY - TURNS_PER_NIGHT);
}

export function turnOfDay(state: RawState) {
  return state.time.turn % TURNS_PER_DAY;
}

export function turnsUntilSunriseOrSunset(state: RawState) {
  if (isNight(state)) {
    if (turnOfDay(state) === 0) return 1;
    return TURNS_PER_DAY - turnOfDay(state) + 1;
  } else {
    return TURNS_PER_DAY - TURNS_PER_NIGHT - turnOfDay(state) + 1;
  }
}

export function turnsUntilVictory(state: RawState) {
  return VICTORY_ON_TURN - state.time.turn;
}

export function version(state: RawState) {
  return state.version;
}

export function messageLog(state: RawState) {
  return state.messageLog;
}

export function resources(state: RawState) {
  return state.resources;
}

export function resource(state: RawState, resourceCode: ResourceCode) {
  return resources(state)[resourceCode];
}

export function resourceChanges(state: RawState) {
  return state.resourceChanges;
}

export function resourceChange(state: RawState, resourceCode: ResourceCode) {
  return resourceChanges(state)[resourceCode];
}

export function canAffordToPay(
  state: RawState,
  resourceCode: ResourceCode,
  cost: number,
) {
  return resource(state, resourceCode) >= cost;
}

export function isWeaponActive(state: RawState): boolean {
  return state.laserState === "ACTIVE";
}

export function laserState(state: RawState) {
  return state.laserState;
}

export function lastAimingDirection(state: RawState) {
  return state.lastAimingDirection;
}

export function jobPriorities(state: RawState) {
  return state.jobPriorities;
}

export function jobPriority(state: RawState, jobType: JobTypeCode) {
  return jobPriorities(state)[jobType];
}

export function cursorPos(state: RawState) {
  return state.cursorPos;
}

export function isInProjectorRange(state: RawState, pos?: Pos | null): boolean {
  if (!pos) return false;
  return (
    entitiesWithComps(state, "projector", "pos")
      .filter((e) => getDistance(pos, e.pos) <= e.projector.range)
      .filter((e) => !e.powered || e.powered.hasPower).length > 0
  );
}
