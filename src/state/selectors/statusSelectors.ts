import { RawState } from "~types";
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

export function turnsUntilNextImmigrant(state: RawState) {
  return state.turnsUntilNextImmigrant;
}

export function morale(state: RawState) {
  return state.morale;
}

export function isNight(state: RawState) {
  return state.time.isNight;
}

export function turnsUntilTimeChange(state: RawState) {
  return state.time.turnsUntilChange;
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

export function resource(state: RawState, resourceName: Resource) {
  return resources(state)[resourceName];
}

export function canAffordToPay(
  state: RawState,
  resourceName: Resource,
  cost: number,
) {
  return resource(state, resourceName) >= cost;
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

export function jobPriority(state: RawState, jobType: JobType) {
  return jobPriorities(state)[jobType];
}
