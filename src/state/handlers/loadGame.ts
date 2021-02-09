import colors from "~colors";
import renderer from "~renderer";
import { registerHandler } from "~state/handleAction";
import processAnimationToggle from "~state/processors/processAnimationToggle";
import processBorders from "~state/processors/processBorders";
import processEmitters from "~state/processors/processEmitters";
import WrappedState from "~types/WrappedState";
import { resetEntitiesByCompAndPos } from "~utils/entities";
import actions from "../actions";
import { VERSION } from "~constants";

function loadGame(
  state: WrappedState,
  action: ReturnType<typeof actions.loadGame>,
): void {
  const { state: loadedState } = action.payload;
  state.setRaw({
    ...loadedState,
    version: VERSION,
  });
  resetEntitiesByCompAndPos(state);
  state.act.setCursorPos(null);
  renderer.clear();
  state.select
    .entitiesWithComps("pos", "display")
    .forEach((entity) => renderer.addEntity(entity));
  processEmitters(state);
  processAnimationToggle(state);
  processBorders(state);
  if (state.select.isNight()) {
    renderer.setBackgroundColor(colors.backgroundNight);
  } else {
    renderer.setBackgroundColor(colors.backgroundDay);
  }
}

registerHandler(loadGame, actions.loadGame);
