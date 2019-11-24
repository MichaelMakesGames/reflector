import { GameState } from "~types";
import actions from "~state/actions";
import * as selectors from "~state/selectors";
import handleAction, { registerHandler } from "~state/handleAction";

function mine(
  prevState: GameState,
  action: ReturnType<typeof actions.mine>,
): GameState {
  let state = prevState;
  const player = selectors.player(state);
  if (!player) return state;

  const adjacentEntities = selectors.adjacentEntities(state, player.pos);
  const entitiesAtPosition = selectors.entitiesAtPosition(state, player.pos);
  const presentAndAdjacentEntities = adjacentEntities.concat(
    entitiesAtPosition,
  );

  if (
    presentAndAdjacentEntities.some(
      entity => entity.mineable && entity.mineable.resource === "METAL",
    )
  ) {
    state = {
      ...state,
      resources: {
        ...state.resources,
        METAL: state.resources.METAL + 1,
      },
    };
    state = handleAction(state, actions.playerTookTurn());
  } else {
    state = {
      ...state,
      messageLog: [...state.messageLog, "Must be next to ore to mine"],
    };
  }

  return state;
}

registerHandler(mine, actions.mine);
