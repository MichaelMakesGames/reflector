import { addRenderEntity, zoomTo, setBackgroundColor } from "~renderer";
import { registerHandler } from "~state/handleAction";
import WrappedState from "~types/WrappedState";
import actions from "../actions";
import processEmitters from "~state/processors/processEmitters";
import colors from "~colors";

function loadGame(
  state: WrappedState,
  action: ReturnType<typeof actions.loadGame>,
): void {
  const { state: loadedState } = action.payload;
  state.setRaw({
    ...loadedState,
    version: state.select.version(),
  });
  state.act.setCursorPos(null);
  state.select
    .entitiesWithComps("pos", "display")
    .forEach((entity) => addRenderEntity(entity));
  const player = state.select.player();
  if (player) {
    zoomTo(player.pos);
  }
  processEmitters(state);
  if (state.select.isNight()) {
    setBackgroundColor(colors.backgroundNight);
  } else {
    setBackgroundColor(colors.backgroundDay);
  }
}

registerHandler(loadGame, actions.loadGame);
