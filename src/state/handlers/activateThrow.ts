import * as actions from "~/state/actions";
import { THROWING_RANGE } from "~/constants";
import { computeThrowFOV } from "~/utils/fov";
import { createEntityFromTemplate } from "~/utils/entities";
import * as selectors from "~/state/selectors";

import { GameState } from "~/types";
import handleAction, { registerHandler } from "~state/handleAction";

function activateThrow(
  state: GameState,
  action: ReturnType<typeof actions.activateThrow>,
): GameState {
  let newState = state;
  const player = selectors.player(newState);
  if (!player) return newState;

  const fovPositions = computeThrowFOV(newState, player.pos, THROWING_RANGE);
  for (const pos of fovPositions) {
    newState = handleAction(
      newState,
      actions.addEntity({
        entity: createEntityFromTemplate("FOV_MARKER", { pos }),
      }),
    );
  }

  const { entity } = action.payload;
  entity.throwing = { range: THROWING_RANGE };
  newState = handleAction(newState, actions.addEntity({ entity }));
  return newState;
}

registerHandler(activateThrow, actions.activateThrow);
