import * as disableActions from "./disableActions";
import * as entityActions from "./entityActions";
import * as inspectActions from "./inspectActions";
import * as loadingActions from "./loadingActions";
import * as miscActions from "./miscActions";
import * as placementActions from "./placementActions";
import * as removeBuildingActions from "./removeBuildingActions";
import * as weaponActions from "./weaponActions";

export default {
  ...disableActions,
  ...entityActions,
  ...inspectActions,
  ...loadingActions,
  ...miscActions,
  ...placementActions,
  ...removeBuildingActions,
  ...weaponActions,
};
