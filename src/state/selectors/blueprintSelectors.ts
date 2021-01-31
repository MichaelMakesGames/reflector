import { RawState } from "~types";
import { entitiesWithComps } from "./entitySelectors";

export function blueprint(state: RawState) {
  const entities = entitiesWithComps(state, "blueprint", "pos", "display");
  if (entities.length) return entities[0];
  return null;
}

export function hasActiveBlueprint(state: RawState): boolean {
  return Boolean(blueprint(state));
}
