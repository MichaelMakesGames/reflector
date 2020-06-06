import actions from "~/state/actions";
import makeLevel from "~/utils/makeLevel";
import { clearRenderer, zoomTo } from "~renderer";
import { registerHandler } from "~state/handleAction";
import initialState from "~state/initialState";
import WrappedState from "~types/WrappedState";

function newGame(
  state: WrappedState,
  action: ReturnType<typeof actions.newGame>,
): void {
  state.setRaw(initialState);
  clearRenderer();
  makeLevel(state);
  const player = state.select.player();
  if (player && player.pos) {
    zoomTo(player.pos);
  }
}

registerHandler(newGame, actions.newGame);
