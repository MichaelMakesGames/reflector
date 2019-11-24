import { addRenderEntity } from "~renderer";
import { registerHandler } from "~state/handleAction";
import WrappedState from "~types/WrappedState";
import actions from "../actions";
import selectors from "../selectors";

function loadGame(
  state: WrappedState,
  action: ReturnType<typeof actions.loadGame>,
): void {
  const { state: loadedState } = action.payload;
  selectors
    .entitiesWithComps(loadedState, "pos", "display")
    .forEach(entity => addRenderEntity(entity));
  state.setRaw({
    ...loadedState,
    version: state.raw.version,
  });
}

registerHandler(loadGame, actions.loadGame);
