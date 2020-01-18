import { Required } from "Object/_api";
import { Entity, Pos, RawState } from "~types";
import { entitiesAtPosition, entitiesWithComps } from "./entitySelectors";

export function placingTarget(state: RawState) {
  const entities = entitiesWithComps(state, "placing", "pos");
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
    entity => entity.mineable && entity.mineable.resource === "METAL",
  );
}

export function canPlaceFarm(state: RawState, pos: Pos) {
  return entitiesAtPosition(state, pos).some(
    entity => entity.mineable && entity.mineable.resource === "FOOD",
  );
}

export function canPlaceReflector(state: RawState, pos: Pos) {
  return entitiesAtPosition(state, pos).every(entity =>
    Boolean(!entity.reflector || entity.placing),
  );
}
