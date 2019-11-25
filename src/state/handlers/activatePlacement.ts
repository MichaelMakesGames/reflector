import { BUILDING_RANGE } from "~/constants";
import actions from "~/state/actions";
import selectors from "~/state/selectors";
import { RawState, Pos } from "~/types";
import { createEntityFromTemplate } from "~/utils/entities";
import { registerHandler } from "~state/handleAction";
import { findValidPositions } from "~utils/building";
import WrappedState from "~types/WrappedState";

function activatePlacement(
  state: WrappedState,
  action: ReturnType<typeof actions.activatePlacement>,
): void {
  const player = state.select.player();
  if (!player) return;

  const { cost, takesTurn, template, validitySelector } = action.payload;

  if (cost && state.raw.resources[cost.resource] < cost.amount) {
    const message = `You do not have enough ${cost.resource}. You have ${
      state.raw.resources[cost.resource]
    } out of ${cost.amount} required`;
    state.act.logMessage({ message });
    return;
  }

  const entityToPlace = createEntityFromTemplate(template, {
    placing: { takesTurn, cost },
  });

  const canPlace = (gameState: RawState, pos: Pos) => {
    if (validitySelector && (selectors as any)[validitySelector]) {
      return Boolean((selectors as any)[validitySelector](gameState, pos));
    } else {
      return true;
    }
  };

  const projectors = state.select.entitiesWithComps("projector", "pos");
  const validPositions = entityToPlace.reflector
    ? findValidPositions(
        state,
        projectors.map(projector => ({
          pos: projector.pos,
          range: projector.projector.range,
        })),
        canPlace,
        true,
      )
    : findValidPositions(
        state,
        [{ pos: player.pos, range: BUILDING_RANGE }],
        canPlace,
        false,
      );

  if (!validPositions.length) {
    const message = "No valid positions in range";
    state.act.logMessage({ message });
    return;
  }

  state.act.closeBuildMenu();
  state.act.addEntity({
    entity: {
      ...entityToPlace,
      pos: action.payload.pos || player.pos,
    },
  });
  state.act.addEntity({
    entity: createEntityFromTemplate("PLACING_MARKER", {
      pos: action.payload.pos || player.pos,
    }),
  });
  for (const pos of validPositions) {
    state.act.addEntity({
      entity: createEntityFromTemplate("VALID_MARKER", { pos }),
    });
  }
}

registerHandler(activatePlacement, actions.activatePlacement);
