import WrappedState from "~types/WrappedState";
import { Entity } from "~types";
import { getAdjacentPositions, getDistance } from "./geometry";
import { ColonistStatusCode } from "~data/colonistStatuses";
import { MAP_WIDTH, MAP_HEIGHT, BUILDING_RANGE } from "~constants";
import { ResourceCode } from "~data/resources";

const conditions: Record<
  ConditionName,
  (state: WrappedState, entity: Entity) => boolean
> = {
  doesNotHaveTallNeighbors(state, entity) {
    if (!entity.pos) return false;
    return getAdjacentPositions(entity.pos).every((pos) =>
      state.select
        .entitiesAtPosition(pos)
        .every((neighbor) => !neighbor.blocking || !neighbor.blocking.windmill),
    );
  },

  isNotBlocked(state, entity) {
    if (!entity.pos) return true;
    const replaceableEntities = state.select
      .entitiesAtPosition(entity.pos)
      .filter(
        (e) =>
          entity.blueprint &&
          entity.blueprint.canReplace &&
          entity.blueprint.canReplace.includes(e.template),
      );
    return !state.select.isPositionBlocked(entity.pos, [
      entity,
      ...replaceableEntities,
    ]);
  },

  isInBuildRange(state, entity) {
    if (!entity.pos) return false;
    const playerPos = state.select.playerPos();
    if (!playerPos) return false;
    return getDistance(playerPos, entity.pos) <= BUILDING_RANGE;
  },

  isNotOnEdgeOfMap(state, entity) {
    if (!entity.pos) return true;
    return (
      entity.pos.x > 0 &&
      entity.pos.y > 0 &&
      entity.pos.x < MAP_WIDTH - 1 &&
      entity.pos.y < MAP_HEIGHT - 1
    );
  },

  isOnOre(state, entity) {
    const { pos } = entity;
    if (!pos) return false;
    return state.select
      .entitiesAtPosition(pos)
      .some((e) => e.mineable && e.mineable.resource === ResourceCode.Metal);
  },

  isOnFertile(state, entity) {
    const { pos } = entity;
    if (!pos) return false;
    return state.select
      .entitiesAtPosition(pos)
      .some((e) => e.mineable && e.mineable.resource === ResourceCode.Food);
  },

  isNotOnOtherBuilding(state, entity) {
    const { pos } = entity;
    if (!pos) return true;
    return state.select
      .entitiesAtPosition(pos)
      .every(
        (e) =>
          !e.building ||
          e === entity ||
          (entity.blueprint ? entity.blueprint.canReplace || [] : []).includes(
            e.template,
          ),
      );
  },

  isDay(state, entity) {
    return !state.select.isNight();
  },

  isPowered(state, entity) {
    return Boolean(entity.powered && entity.powered.hasPower);
  },

  hasOneActiveWorker(state, entity) {
    return (
      state.select
        .employees(entity)
        .filter(
          (employee) => employee.colonist.status === ColonistStatusCode.Working,
        ).length >= 1
    );
  },

  hasTwoActiveWorkers(state, entity) {
    return (
      state.select
        .employees(entity)
        .filter(
          (employee) => employee.colonist.status === ColonistStatusCode.Working,
        ).length >= 2
    );
  },

  hasThreeActiveWorkers(state, entity) {
    return (
      state.select
        .employees(entity)
        .filter(
          (employee) => employee.colonist.status === ColonistStatusCode.Working,
        ).length >= 3
    );
  },
};

export function areConditionsMet(
  state: WrappedState,
  entity: Entity,
  ...conditionNames: (ConditionName | null)[]
) {
  return conditionNames.every(
    (name) => !name || conditions[name](state, entity),
  );
}
