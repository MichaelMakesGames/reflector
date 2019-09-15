import enemies from "./enemies";
import factories from "./factories";
import misc from "./misc";
import pickups from "./pickups";
import terrain from "./terrain";
import weapons from "./weapons";
import lasers from "./lasers";

const templates = {
  ...enemies,
  ...factories,
  ...misc,
  ...pickups,
  ...terrain,
  ...weapons,
  ...lasers,
};

export default templates;
