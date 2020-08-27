import { Required } from "Object/_api";
import { PLAYER_ID } from "~constants";
import { JobTypeCode } from "~data/jobTypes";
import {
  Entity,
  HasColonist,
  HasJobProvider,
  HasPos,
  Pos,
  RawState,
} from "~types";
import { filterEntitiesWithComps } from "~utils/entities";
import {
  arePositionsEqual,
  getAdjacentPositions,
  getPosKey,
} from "~utils/geometry";

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

export function playerPos(state: RawState) {
  const entity = player(state);
  return entity ? entity.pos : null;
}

export function entitiesAtPosition(state: RawState, position: Pos) {
  const key = getPosKey(position);
  return (state.entitiesByPosition[key] || []).map(
    (id) => state.entities[id],
  ) as Required<Entity, "pos">[];
}

export function entitiesAtCursor(state: RawState) {
  const { cursorPos } = state;
  return cursorPos && entitiesAtPosition(state, cursorPos);
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

export function residence(state: RawState, colonist: HasColonist) {
  return entitiesWithComps(state, "pos", "housing").find(
    (e) => e.id === colonist.colonist.residence,
  );
}

export function housingCapacity(state: RawState) {
  return entitiesWithComps(state, "housing")
    .filter((entity) => !entity.housing.removeOnVacancy)
    .reduce((sum, entity) => sum + entity.housing.capacity, 0);
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

export function employees(state: RawState, jobProvider: Entity) {
  return colonists(state).filter(
    (colonist) => colonist.colonist.employment === jobProvider.id,
  );
}

export function jobDisablers(state: RawState) {
  return entitiesWithComps(state, "pos", "jobDisabler");
}

export function enabledJobProviders(state: RawState, jobType?: JobTypeCode) {
  const disablers = jobDisablers(state);
  const jobProviders = entitiesWithComps(
    state,
    "jobProvider",
    "pos",
  ).filter((e) =>
    disablers.map((d) => d.pos).every((pos) => !arePositionsEqual(pos, e.pos)),
  );
  if (jobType) {
    return jobProviders.filter((e) => e.jobProvider.jobType === jobType);
  } else {
    return jobProviders;
  }
}

export function maxNumberEmployed(state: RawState, jobType: JobTypeCode) {
  const providers = enabledJobProviders(state, jobType);
  return providers.reduce(
    (acc, cur) => acc + cur.jobProvider.maxNumberEmployed,
    0,
  );
}

export function numberEmployed(state: RawState, jobType: JobTypeCode) {
  const providers = enabledJobProviders(state, jobType);
  return providers.reduce(
    (acc, cur) => acc + cur.jobProvider.numberEmployed,
    0,
  );
}

export function numberOfUnemployedColonists(state: RawState) {
  return colonists(state).filter((entity) => !entity.colonist.employment)
    .length;
}

export function disableMarker(
  state: RawState,
): null | Required<Entity, "pos" | "disabledMarker"> {
  return entitiesWithComps(state, "pos", "disableMarker")[0] || null;
}
