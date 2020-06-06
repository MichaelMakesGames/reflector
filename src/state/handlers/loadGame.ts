import { addRenderEntity, zoomTo } from "~renderer";
import { registerHandler } from "~state/handleAction";
import WrappedState from "~types/WrappedState";
import actions from "../actions";
import processEmitters from "~state/processors/processEmitters";

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
}

registerHandler(loadGame, actions.loadGame);
