import enemies from "./enemies";
import misc from "./misc";
import buildings from "./buildings";
import terrain from "./terrain";
import weapons from "./weapons";
import lasers from "./lasers";
import { Entity } from "~types";

const templates = {
  ...enemies,
  ...misc,
  ...buildings,
  ...terrain,
  ...weapons,
  ...lasers,
} as Record<TemplateName, Partial<Entity>>;

export default templates;
