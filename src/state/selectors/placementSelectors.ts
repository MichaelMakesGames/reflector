import { Pos, RawState } from "~types";
import { getAdjacentPositions } from "~utils/geometry";
import { entitiesAtPosition, entitiesWithComps } from "./entitySelectors";

export function placingTarget(state: RawState) {
  const entities = entitiesWithComps(state, "placing", "pos", "display");
  if (entities.length) return entities[0];
  return null;
}

export function canPlaceMine(state: RawState, pos: Pos) {
  return entitiesAtPosition(state, pos).some(
    (entity) => entity.mineable && entity.mineable.resource === "METAL",
  );
}

export function canPlaceFarm(state: RawState, pos: Pos) {
  return entitiesAtPosition(state, pos).some(
    (entity) => entity.mineable && entity.mineable.resource === "FOOD",
  );
}

export function canPlaceWindmill(state: RawState, pos: Pos) {
  return getAdjacentPositions(pos).every((adjacentPos) =>
    entitiesAtPosition(state, adjacentPos).every(
      (neighbor) => !neighbor.blocking || !neighbor.blocking.windmill,
    ),
  );
}

export function canPlaceReflector(state: RawState, pos: Pos) {
  return entitiesAtPosition(state, pos).every(
    (entity) => !entity.blocking || !entity.blocking.moving,
  );
}

export function isPlacing(state: RawState): boolean {
  return Boolean(placingTarget(state));
}
