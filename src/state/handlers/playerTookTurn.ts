import * as actions from "~/state/actions";
import processors from "~/state/processors";
import { GameState } from "~/types";
import { registerHandler } from "~state/handleAction";

function playerTookTurn(
  state: GameState,
  action: ReturnType<typeof actions.playerTookTurn>,
): GameState {
  return processors.reduce(
    (prevState, processor) => processor(prevState),
    state,
  );
}

registerHandler(playerTookTurn, actions.playerTookTurn);
