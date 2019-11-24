import { GameState } from "~types";
import actions from "../actions";
import * as selectors from "../selectors";
import { addRenderEntity } from "~renderer";
import { registerHandler } from "~state/handleAction";

function loadGame(
  prevState: GameState,
  action: ReturnType<typeof actions.loadGame>,
): GameState {
  const { state } = action.payload;
  selectors
    .entitiesWithComps(state, "pos", "display")
    .forEach(entity => addRenderEntity(entity));
  return {
    ...state,
    version: prevState.version,
  };
}

registerHandler(loadGame, actions.loadGame);
