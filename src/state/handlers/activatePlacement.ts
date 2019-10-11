import * as actions from "~/state/actions";
import { BUILDING_RANGE } from "~/constants";
import { computeThrowFOV } from "~/utils/fov";
import { createEntityFromTemplate } from "~/utils/entities";
import * as selectors from "~/state/selectors";

import { GameState } from "~/types";
import handleAction, { registerHandler } from "~state/handleAction";

function activatePlacement(
  prevState: GameState,
  action: ReturnType<typeof actions.activatePlacement>,
): GameState {
  let state = prevState;
  const player = selectors.player(state);
  if (!player) return state;

  const { cost, template } = action.payload;

  if (cost && state.resources[cost.resource] < cost.amount) {
    return state;
  }

  state = handleAction(state, actions.closeBuildMenu());

  const fovPositions = computeThrowFOV(state, player.pos, BUILDING_RANGE);
  for (const pos of fovPositions) {
    state = handleAction(
      state,
      actions.addEntity({
        entity: createEntityFromTemplate("FOV_MARKER", { pos }),
      }),
    );
  }

  const entity = createEntityFromTemplate(template, {
    placing: { range: BUILDING_RANGE, cost },
    pos: player.pos,
  });
  state = handleAction(state, actions.addEntity({ entity }));
  return state;
}

registerHandler(activatePlacement, actions.activatePlacement);
