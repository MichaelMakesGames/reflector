import * as actions from "~/state/actions";
import { BUILDING_RANGE } from "~/constants";
import { findValidPositions } from "~utils/building";
import { createEntityFromTemplate } from "~/utils/entities";
import * as selectors from "~/state/selectors";

import { GameState, Pos } from "~/types";
import handleAction, { registerHandler } from "~state/handleAction";
import { getDistance } from "~utils/geometry";

function activatePlacement(
  prevState: GameState,
  action: ReturnType<typeof actions.activatePlacement>,
): GameState {
  let state = prevState;
  const player = selectors.player(state);
  if (!player) return state;

  const { cost, takesTurn, template, validitySelector } = action.payload;

  if (cost && state.resources[cost.resource] < cost.amount) {
    return {
      ...state,
      messageLog: [
        ...state.messageLog,
        `You do not have enough ${cost.resource}. You have ${
          state.resources[cost.resource]
        } out of ${cost.amount} required`,
      ],
    };
  }

  const entityToPlace = createEntityFromTemplate(template, {
    placing: { takesTurn, cost },
    pos: player.pos,
  });

  const canPlace = (gameState: GameState, pos: Pos) => {
    if (validitySelector && (selectors as any)[validitySelector]) {
      return Boolean((selectors as any)[validitySelector](gameState, pos));
    } else {
      return true;
    }
  };

  const projectors = selectors.entitiesWithComps(state, "projector", "pos");
  const validPositions = entityToPlace.reflector
    ? findValidPositions(
        state,
        projectors.map(projector => ({
          pos: projector.pos,
          range: projector.projector.range,
        })),
        canPlace,
      )
    : findValidPositions(
        state,
        [{ pos: player.pos, range: BUILDING_RANGE }],
        canPlace,
      );
  validPositions.sort(
    (a, b) => getDistance(player.pos, a) - getDistance(player.pos, b),
  );

  if (!validPositions.length) {
    return {
      ...state,
      messageLog: [...state.messageLog, "No valid positions in range"],
    };
  }

  state = handleAction(state, actions.closeBuildMenu());
  state = handleAction(
    state,
    actions.addEntity({
      entity: {
        ...entityToPlace,
        pos: validPositions[0],
      },
    }),
  );
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
