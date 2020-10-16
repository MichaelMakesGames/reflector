import actions from "~/state/actions";
import processors from "~/state/processors";
import { registerHandler } from "~state/handleAction";
import { save } from "~utils/gameSave";
import WrappedState from "~types/WrappedState";
import { ResourceCode } from "~data/resources";

function playerTookTurn(
  state: WrappedState,
  action: ReturnType<typeof actions.playerTookTurn>,
): void {
  processors.forEach((processor) => processor(state));
  state.setRaw({
    ...state.raw,
    resourceChanges: state.raw.resourceChangesThisTurn,
    resourceChangesThisTurn: {
      [ResourceCode.Food]: [],
      [ResourceCode.Power]: [],
      [ResourceCode.Metal]: [],
      [ResourceCode.Machinery]: [],
    },
  });
  state.setRaw({
    ...state.raw,
    startOfLastTurn: {
      ...(state.raw.startOfThisTurn || state.raw),
      startOfThisTurn: null,
      startOfLastTurn: null,
    },
  });
  state.setRaw({
    ...state.raw,
    startOfThisTurn: {
      ...state.raw,
      startOfThisTurn: null,
      startOfLastTurn: null,
    },
  });
  save(state.raw);
}

registerHandler(playerTookTurn, actions.playerTookTurn);
