import { GameState, Pos, Entity, MakeRequired } from "~/types";
import { PLAYER_ID } from "~/constants";
import {
  getPosKey,
  getAdjacentPositions,
  arePositionsEqual,
} from "~/utils/geometry";
import { filterEntitiesWithComps } from "~/utils/entities";

export function gameState(state: GameState) {
  return state;
}

export function messageLog(state: GameState) {
  return state.messageLog;
}

export function gameOver(state: GameState) {
  return state.gameOver;
}

export function victory(state: GameState) {
  return state.victory;
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

export function entityById(state: GameState, entityId: string) {
  return state.entities[entityId];
}

export function player(state: GameState) {
  return state.entities[PLAYER_ID] as MakeRequired<
    Entity,
    "pos" | "display" | "conductive"
  > | null;
}

export function entitiesAtPosition(state: GameState, position: Pos) {
  const key = getPosKey(position);
  return (state.entitiesByPosition[key] || []).map(
    id => state.entities[id],
  ) as MakeRequired<Entity, "pos">[];
}

export function adjacentEntities(state: GameState, position: Pos) {
  return getAdjacentPositions(position).reduce<Entity[]>(
    (entities, adjacentPosition) =>
      entities.concat(entitiesAtPosition(state, adjacentPosition)),
    [],
  );
}

export function isPositionBlocked(
  state: GameState,
  position: Pos,
  exceptEntities: Entity[] = [],
) {
  return entitiesAtPosition(state, position).some(
    entity =>
      entity.blocking &&
      entity.blocking.moving &&
      !exceptEntities.includes(entity),
  );
}

export function population(state: GameState): number {
  return entitiesWithComps(state, "housing").reduce(
    (sum, entity) => sum + entity.housing.occupancy,
    0,
  );
}

export function turnsUntilNextImmigrant(state: GameState) {
  return state.turnsUntilNextImmigrant;
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
  }
  return null;
}

export function activeWeapon(state: GameState) {
  const activeWeapons = weapons(state).filter(
    entity => entity.weapon && entity.weapon.active,
  );
  if (activeWeapons.length) {
    return activeWeapons[0];
  }
  return null;
}

export function targetingLasers(state: GameState) {
  return entitiesWithComps(state, "targeting", "pos");
}

export function placingTarget(state: GameState) {
  const entities = entitiesWithComps(state, "placing", "pos");
  if (entities.length) return entities[0];
  return null;
}

export function morale(state: GameState) {
  return state.morale;
}

export function turnsUntilNextWave(state: GameState) {
  return state.wave.turnsUntilNextWaveStart;
}

export function isBuildMenuOpen(state: GameState) {
  return state.isBuildMenuOpen;
}

export function resources(state: GameState) {
  return state.resources;
}

export function canPlaceMine(state: GameState, pos: Pos) {
  return entitiesAtPosition(state, pos).some(
    entity => entity.mineable && entity.mineable.resource === "METAL",
  );
}

export function inspector(
  state: GameState,
): MakeRequired<Entity, "inspector" | "pos"> | null {
  return entitiesWithComps(state, "inspector", "pos")[0] || null;
}

export function inspectedEntities(
  state: GameState,
): MakeRequired<Entity, "description">[] | null {
  const inspectorEntity = inspector(state);
  if (!inspectorEntity) return null;
  return entitiesWithComps(state, "pos", "description").filter(e =>
    arePositionsEqual(e.pos, inspectorEntity.pos),
  );
}
