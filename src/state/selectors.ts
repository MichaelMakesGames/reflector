import { GameState, Pos, Entity, Level, MakeRequired } from "../types";
import { PLAYER_ID } from "../constants";
import { getPosKey, filterEntitiesWithComps } from "../utils";

export function gameState(state: GameState) {
  return state;
}

export function messageLog(state: GameState) {
  return state.messageLog;
}

export function gameOver(state: GameState) {
  return state.gameOver;
}

export function entityList(state: GameState) {
  return Object.values(state.entities);
}

export function entitiesWithComps<C extends keyof Entity>(
  state: GameState,
  ...comps: C[]
): MakeRequired<Entity, C>[] {
  return filterEntitiesWithComps(entityList(state), ...comps);
}

export function entity(state: GameState, entityId: string) {
  return state.entities[entityId];
}

export function player(state: GameState) {
  return state.entities[PLAYER_ID] as MakeRequired<
    Entity,
    "pos" | "hitPoints" | "inventory" | "glyph" | "conductive"
  > | null;
}

export function entitiesAtPosition(state: GameState, position: Pos) {
  const key = getPosKey(position);
  return (state.entitiesByPosition[key] || []).map(
    id => state.entities[id],
  ) as MakeRequired<Entity, "pos">[];
}

export function weapons(state: GameState) {
  return entitiesWithComps(state, "weapon");
}

export function weaponInSlot(state: GameState, slot: number) {
  const weaponsInSlot = weapons(state).filter(
    entity => entity.weapon && entity.weapon.slot === slot,
  );
  if (weaponsInSlot.length) {
    return weaponsInSlot[0];
  } else {
    return null;
  }
}

export function activeWeapon(state: GameState) {
  const activeWeapons = weapons(state).filter(
    entity => entity.weapon && entity.weapon.active,
  );
  if (activeWeapons.length) {
    return activeWeapons[0];
  } else {
    return null;
  }
}

export function targetingLasers(state: GameState) {
  return entitiesWithComps(state, "targeting", "pos");
}

export function throwingTarget(state: GameState) {
  const entities = entitiesWithComps(state, "throwing", "pos");
  if (entities.length) return entities[0];
  return null;
}

export function currentLevel(state: GameState): Level | null {
  const entity = entityList(state).find(e =>
    Boolean(e.level && e.level.current),
  );
  return entity && entity.level ? entity.level : null;
}
