import nanoid from "nanoid";
import templates from "~/data/templates";
import { Entity } from "~/types/Entity";
import WrappedState from "~types/WrappedState";
import { getPosKey } from "./geometry";

export function createEntityFromTemplate(
  templateId: TemplateName,
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

export function resetEntitiesByCompAndPos(state: WrappedState): void {
  const entitiesByComp: Record<string, Set<string>> = {};
  const entitiesByPosition: Record<string, Set<string>> = {};

  for (const entity of state.select.entityList()) {
    if (entity.pos) {
      const key = getPosKey(entity.pos);
      entitiesByPosition[key] = entitiesByPosition[key] || new Set();
      entitiesByPosition[key].add(entity.id);
    }

    for (const key in entity) {
      if (
        entity[key as keyof Entity] &&
        key !== "id" &&
        key !== "template" &&
        key !== "parentTemplate"
      ) {
        entitiesByComp[key] = entitiesByComp[key] || new Set();
        entitiesByComp[key].add(entity.id);
      }
    }
  }

  state.setRaw({
    ...state.raw,
    entitiesByComp,
    entitiesByPosition,
  });
}
