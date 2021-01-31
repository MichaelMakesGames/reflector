import * as disableActions from "./disableActions";
import * as entityActions from "./entityActions";
import * as loadingActions from "./loadingActions";
import * as miscActions from "./miscActions";
import * as blueprintActions from "./blueprintActions";
import * as removeBuildingActions from "./removeBuildingActions";
import * as tutorialActions from "./tutorialActions";
import * as weaponActions from "./weaponActions";

export default {
  ...disableActions,
  ...entityActions,
  ...loadingActions,
  ...miscActions,
  ...blueprintActions,
  ...removeBuildingActions,
  ...tutorialActions,
  ...weaponActions,
};
