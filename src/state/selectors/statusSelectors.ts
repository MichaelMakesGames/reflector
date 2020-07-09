import { RawState } from "~types";
import { entitiesWithComps } from "./entitySelectors";
import { ResourceCode } from "~data/resources";
import { JobTypeCode } from "~data/jobTypes";
import {
  TURNS_PER_DAY,
  TURNS_PER_NIGHT,
  MINUTES_PER_TURN,
  DAY_START_MINUTES,
  VICTORY_ON_TURN,
} from "~constants";

export function population(state: RawState): number {
  return entitiesWithComps(state, "colonist").length;
}

export function gameOver(state: RawState) {
  return state.gameOver;
}

export function victory(state: RawState) {
  return state.victory;
}

export function turnsUntilNextImmigrant(state: RawState) {
  return state.turnsUntilNextImmigrant;
}

export function morale(state: RawState) {
  return state.morale;
}

export function day(state: RawState) {
  return Math.floor(state.time.turn / TURNS_PER_DAY);
}

export function isNight(state: RawState) {
  return turnOfNight(state) >= 0;
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

export function time(state: RawState) {
  const timeInMinutes =
    (turnOfDay(state) * MINUTES_PER_TURN + DAY_START_MINUTES) % (24 * 60);
  const hours = Math.floor(timeInMinutes / 60);
  const minutes = timeInMinutes % 60;
  return Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(0, 0, 0, hours, minutes));
}

export function turnsUntilVictory(state: RawState) {
  return VICTORY_ON_TURN - state.time.turn;
}

export function timeUntilVictory(state: RawState) {
  const minutesUntilVictory = turnsUntilVictory(state) * MINUTES_PER_TURN;
  const days = Math.floor(minutesUntilVictory / (24 * 60));
  const hours = Math.floor((minutesUntilVictory - days * 24 * 60) / 60);
  const minutes = minutesUntilVictory - days * 24 * 60 - hours * 60;
  return `${days ? `${days}d ` : ""}${hours}h ${minutes}m`;
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
  return state.isWeaponActive;
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
