import * as entitySelectors from "./entitySelectors";
import * as miscSelectors from "./miscSelectors";
import * as blueprintSelectors from "./blueprintSelectors";
import * as statusSelectors from "./statusSelectors";
import * as tutorialSelectors from "./tutorialSelectors";
import { RawState } from "../../types";

export default {
  ...entitySelectors,
  ...miscSelectors,
  ...blueprintSelectors,
  ...statusSelectors,
  ...tutorialSelectors,
  state: (s: RawState) => s,
};
