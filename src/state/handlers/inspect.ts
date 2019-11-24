import { GameState } from "~types";
import actions from "../actions";
import * as selectors from "../selectors";
import handleAction, { registerHandler } from "~state/handleAction";
import { createEntityFromTemplate } from "~utils/entities";

function inspect(state: GameState, action: ReturnType<typeof actions.inspect>) {
  const player = selectors.player(state);
  if (!player) return state;
  return handleAction(
    state,
    actions.addEntity({
      entity: createEntityFromTemplate("INSPECTOR", { pos: player.pos }),
    }),
  );
}

registerHandler(inspect, actions.inspect);
