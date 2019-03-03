import { GameState, Position } from "../types";

export function gameState(state: GameState) {
  return state;
}

export function entities(state: GameState) {
  return state.entities;
}

export function entityList(state: GameState) {
  return Object.values(state.entities);
}

export function entitiesAtPosition(state: GameState, position: Position) {
  return Object.values(entities(state)).filter(
    entity =>
      entity.position &&
      entity.position.x === position.x &&
      entity.position.y === position.y
  );
}

export function weapons(state: GameState) {
  return Object.values(entities(state)).filter(entity => entity.weapon);
}

export function weaponInSlot(state: GameState, slot: number) {
  const weaponsInSlot = weapons(state).filter(
    entity => entity.weapon && entity.weapon.slot === slot
  );
  if (weaponsInSlot.length) {
    return weaponsInSlot[0];
  } else {
    return null;
  }
}

export function activeWeapon(state: GameState) {
  const activeWeapons = weapons(state).filter(
    entity => entity.weapon && entity.weapon.active
  );
  if (activeWeapons.length) {
    return activeWeapons[0];
  } else {
    return null;
  }
}

export function targetingLasers(state: GameState) {
  return entityList(state).filter(entity => entity.targeting);
}
export function entity(state: GameState, entityId: string) {
  return state.entities[entityId];
}
