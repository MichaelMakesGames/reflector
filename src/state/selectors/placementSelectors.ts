import { entitiesAtPosition, entitiesWithComps } from "./entitySelectors";
import { RawState, MakeRequired, Entity, Pos } from "~types";

export function placingTarget(state: RawState) {
  const entities = entitiesWithComps(state, "placing", "pos");
  if (entities.length) return entities[0];
  return null;
}

export function placingMarker(
  state: RawState,
): MakeRequired<Entity, "placingMarker" | "pos" | "display"> | null {
  return entitiesWithComps(state, "placingMarker", "pos", "display")[0] || null;
}

export function canPlaceMine(state: RawState, pos: Pos) {
  return entitiesAtPosition(state, pos).some(
    entity => entity.mineable && entity.mineable.resource === "METAL",
  );
}

export function canPlaceReflector(state: RawState, pos: Pos) {
  return entitiesAtPosition(state, pos).every(entity =>
    Boolean(!entity.reflector || entity.placing),
  );
}
