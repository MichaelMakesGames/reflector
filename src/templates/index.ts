import { Entity } from "../types";
import nanoid = require("nanoid");

import enemies from "./enemies";
import factories from "./factories";
import misc from "./misc";
import pickups from "./pickups";
import terrain from "./terrain";
import weapons from "./weapons";

const templates = {
  ...enemies,
  ...factories,
  ...misc,
  ...pickups,
  ...terrain,
  ...weapons,
};

export function createEntityFromTemplate(
  templateId: string,
  additionalComps?: Partial<Entity>,
) {
  const template = templates[templateId];
  const parent: Entity = template.parentTemplate
    ? createEntityFromTemplate(template.parentTemplate)
    : { id: nanoid() };

  return {
    ...parent,
    ...templates[templateId],
    ...additionalComps,
  };
}
