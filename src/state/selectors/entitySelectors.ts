import { Required } from "Object/_api";
import { PLAYER_ID } from "~constants";
import {
  Entity,
  Pos,
  RawState,
  HasColonist,
  HasJobProvider,
  HasPos,
} from "~types";
import { filterEntitiesWithComps } from "~utils/entities";
import { getAdjacentPositions, getPosKey } from "~utils/geometry";

export function entityList(state: RawState) {
  return Object.values(state.entities);
}

export function entitiesWithComps<C extends keyof Entity>(
  state: RawState,
  ...comps: C[]
): Required<Entity, C>[] {
  return filterEntitiesWithComps(entityList(state), ...comps);
}

export function entityById(state: RawState, entityId: string) {
  return state.entities[entityId];
}

export function player(state: RawState) {
  return state.entities[PLAYER_ID] as Required<
    Entity,
    "pos" | "display" | "conductive"
  > | null;
}

export function entitiesAtPosition(state: RawState, position: Pos) {
  const key = getPosKey(position);
  return (state.entitiesByPosition[key] || []).map(
    (id) => state.entities[id],
  ) as Required<Entity, "pos">[];
}

export function adjacentEntities(state: RawState, position: Pos) {
  return getAdjacentPositions(position).reduce<Entity[]>(
    (entities, adjacentPosition) =>
      entities.concat(entitiesAtPosition(state, adjacentPosition)),
    [],
  );
}

export function isPositionBlocked(
  state: RawState,
  position: Pos,
  exceptEntities: Entity[] = [],
) {
  return entitiesAtPosition(state, position).some(
    (entity) =>
      entity.blocking &&
      entity.blocking.moving &&
      !exceptEntities.includes(entity),
  );
}

export function colonists(state: RawState) {
  return entitiesWithComps(state, "pos", "colonist", "display");
}

export function employment(state: RawState, colonist: HasColonist) {
  if (
    colonist.colonist.employment &&
    entityById(state, colonist.colonist.employment)
  ) {
    return entityById(state, colonist.colonist.employment) as Entity &
      HasJobProvider &
      HasPos;
  } else {
    return null;
  }
}

export function jobDisablers(state: RawState) {
  return entitiesWithComps(state, "pos", "jobDisabler");
}

export function disableMarker(
  state: RawState,
): null | Required<Entity, "pos" | "disabledMarker"> {
  return entitiesWithComps(state, "pos", "disableMarker")[0] || null;
}
