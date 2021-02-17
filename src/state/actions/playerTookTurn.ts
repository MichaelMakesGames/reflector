import { createStandardAction } from "typesafe-actions";
import systems from "~state/systems";
import { ResourceCode } from "~data/resources";
import { registerHandler } from "~state/handleAction";
import WrappedState from "~types/WrappedState";
import { save } from "~lib/gameSave";

const playerTookTurn = createStandardAction("PLAYER_TOOK_TURN")();
export default playerTookTurn;

function playerTookTurnHandler(
  state: WrappedState,
  action: ReturnType<typeof playerTookTurn>,
): void {
  systems.forEach((system) => system(state));
  state.act.setAutoMovePathToCursor();
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

registerHandler(playerTookTurnHandler, playerTookTurn);
