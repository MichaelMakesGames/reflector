import { createAction } from "typesafe-actions";
import { ResourceCode } from "../../data/resources";
import WrappedState from "../../types/WrappedState";
import { registerHandler } from "../handleAction";
import { cosmeticSystems, turnEndSystems } from "../systems";

const playerTookTurn = createAction("PLAYER_TOOK_TURN")();
export default playerTookTurn;

function playerTookTurnHandler(
  state: WrappedState,
  action: ReturnType<typeof playerTookTurn>
): void {
  state.setRaw({
    ...state.raw,
    lastMoveWasFast: false,
  });

  turnEndSystems.forEach((system) => system(state));
  cosmeticSystems.forEach((system) => system(state));
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

  state.save(state.raw);
}

registerHandler(playerTookTurnHandler, playerTookTurn);
