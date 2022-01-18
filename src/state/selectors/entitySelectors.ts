import { Required } from "ts-toolbelt/out/Object/Required";
import { PLAYER_ID } from "../../constants";
import { JobTypeCode } from "../../data/jobTypes";
import { Entity, Pos, RawState } from "../../types";
import {
  arePositionsEqual,
  getAdjacentPositions,
  getPosKey,
} from "../../lib/geometry";
import { sum } from "../../lib/math";
import { TemplateName } from "../../types/TemplateName";

export function entityList(state: RawState) {
  return Object.values(state.entities);
}

export function entitiesWithComps<C extends keyof Entity>(
  state: RawState,
  ...comps: C[]
): Required<Entity, C>[] {
  const entities: any[] = [];
  let ids: string[] = [];
  if (comps.length === 1) {
    if (state.entitiesByComp[comps[0]]) {
      ids = Array.from(state.entitiesByComp[comps[0]]);
    }
  } else {
    const byComps = comps
      .map((comp) => state.entitiesByComp[comp] || new Set())
      .sort((a, b) => a.size - b.size);
    const [smallest, ...rest] = byComps;
    ids = Array.from(smallest).filter((id) =>
      rest.every((idSet) => idSet.has(id))
    );
  }

  for (let i = 0; i < ids.length; i++) {
    entities.push(state.entities[ids[i]]);
  }
  return entities;
}

export function entitiesWithTemplate(state: RawState, template: TemplateName) {
  return entityList(state).filter((e) => e.template === template);
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
  return Array.from(state.entitiesByPosition[key] || []).map(
    (id) => state.entities[id]
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
    []
  );
}

export function isPositionBlocked(
  state: RawState,
  position: Pos,
  exceptEntities: Entity[] = []
) {
  return entitiesAtPosition(state, position).some(
    (entity) =>
      entity.blocking &&
      entity.blocking.moving &&
      !exceptEntities.includes(entity)
  );
}

export function colonists(state: RawState) {
  return entitiesWithComps(state, "pos", "colonist", "display");
}

export function residence(
  state: RawState,
  colonist: Required<Entity, "colonist">
) {
  return entitiesWithComps(state, "pos", "housing").find(
    (e) => e.id === colonist.colonist.residence
  );
}

export function residents(state: RawState, entity: Entity) {
  return colonists(state).filter(
    (colonist) => colonist.colonist.residence === entity.id
  );
}

export function housingCapacity(state: RawState) {
  return entitiesWithComps(state, "housing").reduce(
    (acc, entity) => acc + entity.housing.capacity,
    0
  );
}

export function homelessColonists(state: RawState) {
  return colonists(state).filter((eColonist) => {
    if (!eColonist.colonist.residence) return true;
    const eResidence = residence(state, eColonist);
    if (!eResidence) return true;
    return false;
  });
}

export function residencesUnderCapacity(state: RawState) {
  return entitiesWithComps(state, "housing", "pos").filter(
    (e) => e.housing.occupancy < e.housing.capacity
  );
}

export function employment(
  state: RawState,
  colonist: Required<Entity, "colonist">
) {
  if (
    colonist.colonist.employment &&
    entityById(state, colonist.colonist.employment)
  ) {
    return entityById(state, colonist.colonist.employment) as Required<
      Entity,
      "pos" | "jobProvider"
    >;
  } else {
    return null;
  }
}

export function employees(state: RawState, jobProvider: Entity) {
  return colonists(state).filter(
    (colonist) => colonist.colonist.employment === jobProvider.id
  );
}

export function jobDisablers(state: RawState) {
  return entitiesWithComps(state, "pos", "jobDisabler");
}

export function jobProviders(state: RawState, jobType?: JobTypeCode) {
  return entitiesWithComps(state, "jobProvider", "pos").filter(
    (e) => !jobType || e.jobProvider.jobType === jobType
  );
}

export function enabledJobProviders(state: RawState, jobType?: JobTypeCode) {
  const disablers = jobDisablers(state);
  return jobProviders(state, jobType).filter((e) =>
    disablers.map((d) => d.pos).every((pos) => !arePositionsEqual(pos, e.pos))
  );
}

export function disabledJobProviders(state: RawState, jobType?: JobTypeCode) {
  const disablers = jobDisablers(state);
  return jobProviders(state, jobType).filter((e) =>
    disablers.map((d) => d.pos).some((pos) => arePositionsEqual(pos, e.pos))
  );
}

export function numberOfDisabledJobs(state: RawState, jobType: JobTypeCode) {
  return sum(
    ...disabledJobProviders(state, jobType).map(
      (e) => e.jobProvider.maxNumberEmployed
    )
  );
}

export function maxNumberEmployed(state: RawState, jobType?: JobTypeCode) {
  const providers = enabledJobProviders(state, jobType);
  return providers.reduce(
    (acc, cur) => acc + cur.jobProvider.maxNumberEmployed,
    0
  );
}

export function numberEmployed(state: RawState, jobType: JobTypeCode) {
  const providers = jobProviders(state, jobType);
  return providers.reduce(
    (acc, cur) => acc + cur.jobProvider.numberEmployed,
    0
  );
}

export function colonistsEmployedInJobType(
  state: RawState,
  jobType: JobTypeCode
) {
  const providers = enabledJobProviders(state, jobType);

  const providerIds = new Set<null | string>(providers.map((e) => e.id));
  return colonists(state).filter((e) => providerIds.has(e.colonist.employment));
}

export function numberOfUnemployedColonists(state: RawState) {
  return colonists(state).filter((entity) => !entity.colonist.employment)
    .length;
}

export function areThereMoreJobsThanColonists(state: RawState) {
  const numColonists = entitiesWithComps(state, "colonist").length;
  const numJobs = maxNumberEmployed(state);
  return numJobs > numColonists;
}

export function areEnemiesPresent(state: RawState) {
  return entitiesWithComps(state, "ai").length > 0;
}

export function canFly(state: RawState, entity: Entity) {
  return Boolean(entity.ai && entity.ai.type === "FLYER");
}

export function isFlyable(state: RawState, entity: Entity) {
  return Boolean(!entity.blocking || !entity.blocking.lasers);
}

export function hasRoad(state: RawState, pos: Pos) {
  return entitiesAtPosition(state, pos).some((e) => e.road);
}
