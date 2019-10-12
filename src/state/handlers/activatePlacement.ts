import * as actions from "~/state/actions";
import { BUILDING_RANGE } from "~/constants";
import { findValidPositions } from "~utils/building";
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

  const entity = createEntityFromTemplate(template, {
    placing: { range: BUILDING_RANGE, cost },
    pos: player.pos,
  });
  state = handleAction(state, actions.addEntity({ entity }));

  const projectors = selectors.entitiesWithComps(state, "projector", "pos");
  const validPositions = entity.reflector
    ? findValidPositions(
        state,
        projectors.map(projector => ({
          pos: projector.pos,
          range: projector.projector.range,
        })),
      )
    : findValidPositions(state, [{ pos: player.pos, range: BUILDING_RANGE }]);
  for (const pos of validPositions) {
    state = handleAction(
      state,
      actions.addEntity({
        entity: createEntityFromTemplate("VALID_MARKER", { pos }),
      }),
    );
  }

  return state;
}

registerHandler(activatePlacement, actions.activatePlacement);
