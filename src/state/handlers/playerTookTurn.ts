import * as actions from "~/state/actions";
import processors from "~/state/processors";
import { GameState } from "~/types";
import { registerHandler } from "~state/handleAction";
import { save } from "~utils/gameSave";

function playerTookTurn(
  state: GameState,
  action: ReturnType<typeof actions.playerTookTurn>,
): GameState {
  const newState = processors.reduce(
    (prevState, processor) => processor(prevState),
    state,
  );
  save(newState);
  return newState;
}

registerHandler(playerTookTurn, actions.playerTookTurn);
