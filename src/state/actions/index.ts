import * as disableActions from "./disableActions";
import * as entityActions from "./entityActions";
import * as loadingActions from "./loadingActions";
import * as miscActions from "./miscActions";
import * as placementActions from "./placementActions";
import * as removeBuildingActions from "./removeBuildingActions";
import * as weaponActions from "./weaponActions";

export default {
  ...disableActions,
  ...entityActions,
  ...loadingActions,
  ...miscActions,
  ...placementActions,
  ...removeBuildingActions,
  ...weaponActions,
};
