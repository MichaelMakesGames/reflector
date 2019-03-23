import { Entity, MakeRequired } from "../types";

export function filterEntitiesWithComps<C extends keyof Entity>(
  entities: Entity[],
  ...comps: C[]
) {
  return entities.filter(e =>
    comps.every(comp => Boolean(e[comp])),
  ) as MakeRequired<Entity, C>[];
}
