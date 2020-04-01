import actions from "~/state/actions";
import processors from "~/state/processors";
import { registerHandler } from "~state/handleAction";
import { save } from "~utils/gameSave";
import WrappedState from "~types/WrappedState";

function playerTookTurn(
  state: WrappedState,
  action: ReturnType<typeof actions.playerTookTurn>,
): void {
  processors.forEach((processor) => processor(state));
  save(state.raw);
}

registerHandler(playerTookTurn, actions.playerTookTurn);
