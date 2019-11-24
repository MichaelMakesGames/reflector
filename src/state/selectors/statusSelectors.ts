import { GameState } from "~types";
import { entitiesWithComps } from "./entitySelectors";

export function population(state: GameState): number {
  return entitiesWithComps(state, "housing").reduce(
    (sum, entity) => sum + entity.housing.occupancy,
    0,
  );
}

export function gameOver(state: GameState) {
  return state.gameOver;
}

export function victory(state: GameState) {
  return state.victory;
}

export function turnsUntilNextImmigrant(state: GameState) {
  return state.turnsUntilNextImmigrant;
}

export function morale(state: GameState) {
  return state.morale;
}

export function isNight(state: GameState) {
  return state.time.isNight;
}

export function turnsUntilTimeChange(state: GameState) {
  return state.time.turnsUntilChange;
}

export function version(state: GameState) {
  return state.version;
}

export function messageLog(state: GameState) {
  return state.messageLog;
}

export function isBuildMenuOpen(state: GameState) {
  return state.isBuildMenuOpen;
}

export function resources(state: GameState) {
  return state.resources;
}

export function activeWeapon(state: GameState) {
  const activeWeapons = entitiesWithComps(state, "weapon").filter(
    entity => entity.weapon && entity.weapon.active,
  );
  if (activeWeapons.length) {
    return activeWeapons[0];
  }
  return null;
}
