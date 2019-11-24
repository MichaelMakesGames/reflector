import { GameState, Entity, MakeRequired, Pos } from "~types";
import { filterEntitiesWithComps } from "~utils/entities";
import { PLAYER_ID } from "~constants";
import { getPosKey, getAdjacentPositions } from "~utils/geometry";

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
