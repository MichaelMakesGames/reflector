import nanoid from "nanoid";
import templates from "../data/templates";
import { Entity } from "../types/Entity";
import { MakeRequired } from "../types";

export function createEntityFromTemplate(
  templateId: string,
  additionalComps?: Partial<Entity>,
) {
  const template = templates[templateId];
  const parent: Entity = template.parentTemplate
    ? createEntityFromTemplate(template.parentTemplate)
    : { id: "tempId" };

  return {
    ...parent,
    ...templates[templateId],
    ...additionalComps,
    id: `${templateId}_${nanoid()}`,
  };
}

export function filterEntitiesWithComps<C extends keyof Entity>(
  entities: Entity[],
  ...comps: C[]
) {
  return entities.filter(e =>
    comps.every(comp => Boolean(e[comp])),
  ) as MakeRequired<Entity, C>[];
}
