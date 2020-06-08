import actions from "~/state/actions";
import processors from "~/state/processors";
import { registerHandler } from "~state/handleAction";
import { save } from "~utils/gameSave";
import WrappedState from "~types/WrappedState";
import initialState from "~state/initialState";

function playerTookTurn(
  state: WrappedState,
  action: ReturnType<typeof actions.playerTookTurn>,
): void {
  processors.forEach((processor) => processor(state));
  state.setRaw({
    ...state.raw,
    resourceChanges: state.raw.resourceChangesThisTurn,
    resourceChangesThisTurn: initialState.resourceChangesThisTurn,
  });
  save(state.raw);
}

registerHandler(playerTookTurn, actions.playerTookTurn);
