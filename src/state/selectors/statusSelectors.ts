import { RawState } from "~types";
import { entitiesWithComps } from "./entitySelectors";

export function population(state: RawState): number {
  return entitiesWithComps(state, "housing").reduce(
    (sum, entity) => sum + entity.housing.occupancy,
    0,
  );
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

export function isBuildMenuOpen(state: RawState) {
  return state.isBuildMenuOpen;
}

export function resources(state: RawState) {
  return state.resources;
}

export function activeWeapon(state: RawState) {
  const activeWeapons = entitiesWithComps(state, "weapon").filter(
    entity => entity.weapon && entity.weapon.active,
  );
  if (activeWeapons.length) {
    return activeWeapons[0];
  }
  return null;
}
