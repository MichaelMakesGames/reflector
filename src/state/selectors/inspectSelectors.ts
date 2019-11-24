import { Required } from "Object/_api";
import { Entity, RawState } from "~types";
import { arePositionsEqual } from "~utils/geometry";
import { entitiesWithComps } from "./entitySelectors";

export function inspector(
  state: RawState,
): Required<Entity, "inspector" | "pos"> | null {
  return entitiesWithComps(state, "inspector", "pos")[0] || null;
}

export function inspectedEntities(
  state: RawState,
): Required<Entity, "description">[] | null {
  const inspectorEntity = inspector(state);
  if (!inspectorEntity) return null;
  return entitiesWithComps(state, "pos", "description").filter(e =>
    arePositionsEqual(e.pos, inspectorEntity.pos),
  );
}
