import { RawState, MakeRequired, Entity } from "~types";
import { entitiesWithComps } from "./entitySelectors";
import { arePositionsEqual } from "~utils/geometry";

export function inspector(
  state: RawState,
): MakeRequired<Entity, "inspector" | "pos"> | null {
  return entitiesWithComps(state, "inspector", "pos")[0] || null;
}

export function inspectedEntities(
  state: RawState,
): MakeRequired<Entity, "description">[] | null {
  const inspectorEntity = inspector(state);
  if (!inspectorEntity) return null;
  return entitiesWithComps(state, "pos", "description").filter(e =>
    arePositionsEqual(e.pos, inspectorEntity.pos),
  );
}
