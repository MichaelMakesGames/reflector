import * as entityActions from "./entityActions";
import * as inspectActions from "./inspectActions";
import * as loadingActions from "./loadingActions";
import * as miscActions from "./miscActions";
import * as placementActions from "./placementActions";
import * as weaponActions from "./weaponActions";

export default {
  ...entityActions,
  ...inspectActions,
  ...loadingActions,
  ...miscActions,
  ...placementActions,
  ...weaponActions,
};
