import * as entitySelectors from "./entitySelectors";
import * as inspectSelectors from "./inspectSelectors";
import * as placementSelectors from "./placementSelectors";
import * as statusSelectors from "./statusSelectors";

export default {
  ...entitySelectors,
  ...inspectSelectors,
  ...placementSelectors,
  ...statusSelectors,
};
