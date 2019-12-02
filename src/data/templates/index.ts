import enemies from "./enemies";
import misc from "./misc";
import buildings from "./buildings";
import terrain from "./terrain";
import lasers from "./lasers";
import { Entity } from "~types";

const templates = {
  ...enemies,
  ...misc,
  ...buildings,
  ...terrain,
  ...lasers,
} as Record<TemplateName, Partial<Entity>>;

export default templates;
