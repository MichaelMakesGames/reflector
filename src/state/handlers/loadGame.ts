import colors from "~colors";
import { addRenderEntity, clearRenderer, setBackgroundColor } from "~renderer";
import { registerHandler } from "~state/handleAction";
import processAnimationToggle from "~state/processors/processAnimationToggle";
import processBorders from "~state/processors/processBorders";
import processEmitters from "~state/processors/processEmitters";
import WrappedState from "~types/WrappedState";
import { resetEntitiesByCompAndPos } from "~utils/entities";
import actions from "../actions";

function loadGame(
  state: WrappedState,
  action: ReturnType<typeof actions.loadGame>,
): void {
  const { state: loadedState } = action.payload;
  state.setRaw({
    ...loadedState,
    version: state.select.version(),
  });
  resetEntitiesByCompAndPos(state);
  state.act.setCursorPos(null);
  clearRenderer();
  state.select
    .entitiesWithComps("pos", "display")
    .forEach((entity) => addRenderEntity(entity));
  processEmitters(state);
  processAnimationToggle(state);
  processBorders(state);
  if (state.select.isNight()) {
    setBackgroundColor(colors.backgroundNight);
  } else {
    setBackgroundColor(colors.backgroundDay);
  }
}

registerHandler(loadGame, actions.loadGame);
