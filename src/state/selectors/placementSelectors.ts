import { Required } from "Object/_api";
import { Entity, Pos, RawState } from "~types";
import { entitiesAtPosition, entitiesWithComps } from "./entitySelectors";
import { getAdjacentPositions } from "~utils/geometry";

export function placingTarget(state: RawState) {
  const entities = entitiesWithComps(state, "placing", "pos", "display");
  if (entities.length) return entities[0];
  return null;
}

export function placingMarker(
  state: RawState,
): Required<Entity, "placingMarker" | "pos" | "display"> | null {
  return entitiesWithComps(state, "placingMarker", "pos", "display")[0] || null;
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
  return entitiesAtPosition(state, pos).every((entity) =>
    Boolean(!entity.reflector || entity.placing),
  );
}

export function removingMarker(
  state: RawState,
): Required<Entity, "removingMarker" | "pos"> | null {
  return entitiesWithComps(state, "removingMarker", "pos")[0] || null;
}

export function isPlacing(state: RawState): boolean {
  return Boolean(placingTarget(state));
}
