import nanoid from "nanoid";
import templates from "../data/templates";
import { Entity } from "../types/types";

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
