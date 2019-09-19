import enemies from "./enemies";
import misc from "./misc";
import buildings from "./buildings";
import terrain from "./terrain";
import weapons from "./weapons";
import lasers from "./lasers";

const templates = {
  ...enemies,
  ...misc,
  ...buildings,
  ...terrain,
  ...weapons,
  ...lasers,
};

export default templates;
