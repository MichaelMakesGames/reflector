import { Entity } from "../../types";
import { TemplateName } from "../../types/TemplateName";
import blueprints from "./blueprints";
import buildings from "./buildings";
import enemies from "./enemies";
import lasers from "./lasers";
import misc from "./misc";
import terrain from "./terrain";

const templates = {
  ...enemies,
  ...misc,
  ...blueprints,
  ...buildings,
  ...terrain,
  ...lasers,
} as Record<TemplateName, Partial<Entity>>;

export default templates;
