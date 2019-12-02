import actions from "~/state/actions";
import makeLevel from "~/utils/makeLevel";
import { clearRenderer } from "~renderer";
import { registerHandler } from "~state/handleAction";
import initialState from "~state/initialState";
import WrappedState from "~types/WrappedState";

function init(
  state: WrappedState,
  action: ReturnType<typeof actions.newGame>,
): void {
  state.setRaw(initialState);
  clearRenderer();
  makeLevel(state);
}

registerHandler(init, actions.newGame);
