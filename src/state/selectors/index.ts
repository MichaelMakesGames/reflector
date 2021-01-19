import * as entitySelectors from "./entitySelectors";
import * as miscSelectors from "./miscSelectors";
import * as placementSelectors from "./placementSelectors";
import * as statusSelectors from "./statusSelectors";
import * as tutorialSelectors from "./tutorialSelectors";
import { RawState } from "~types";

export default {
  ...entitySelectors,
  ...miscSelectors,
  ...placementSelectors,
  ...statusSelectors,
  ...tutorialSelectors,
  state: (s: RawState) => s,
};
