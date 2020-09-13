import actions from "~/state/actions";
import makeLevel from "~/utils/makeLevel";
import { clearRenderer } from "~renderer";
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
  state.act.loadGame({ state: state.raw });
}

registerHandler(newGame, actions.newGame);
