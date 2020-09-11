import * as entitySelectors from "./entitySelectors";
import * as inspectSelectors from "./inspectSelectors";
import * as placementSelectors from "./placementSelectors";
import * as statusSelectors from "./statusSelectors";
import * as miscSelectors from "./miscSelectors";
import { RawState } from "~types";

export default {
  ...entitySelectors,
  ...inspectSelectors,
  ...placementSelectors,
  ...statusSelectors,
  ...miscSelectors,
  state: (s: RawState) => s,
};
