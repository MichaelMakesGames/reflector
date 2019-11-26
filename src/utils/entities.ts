import nanoid from "nanoid";
import { Required } from "Object/_api";
import templates from "~/data/templates";
import { Entity } from "~/types/Entity";

export function createEntityFromTemplate(
  templateId: string,
  additionalComps?: Partial<Entity>,
) {
  const template = templates[templateId];
  const parent: Entity = template.parentTemplate
    ? createEntityFromTemplate(template.parentTemplate)
    : { id: "tempId", template: "NONE" };

  return {
    ...parent,
    ...templates[templateId],
    ...additionalComps,
    id: `${templateId}_${nanoid()}`,
    template: templateId,
  };
}

export function filterEntitiesWithComps<C extends keyof Entity>(
  entities: Entity[],
  ...comps: C[]
) {
  return entities.filter(e =>
    comps.every(comp => Boolean(e[comp])),
  ) as Required<Entity, C>[];
}
