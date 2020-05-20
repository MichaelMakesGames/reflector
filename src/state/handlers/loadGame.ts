import { addRenderEntity } from "~renderer";
import { registerHandler } from "~state/handleAction";
import WrappedState from "~types/WrappedState";
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
  state.act.setCursorPos(null);
  state.select
    .entitiesWithComps("pos", "display")
    .forEach((entity) => addRenderEntity(entity));
}

registerHandler(loadGame, actions.loadGame);
