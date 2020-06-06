import { BUILDING_RANGE } from "~/constants";
import actions from "~/state/actions";
import selectors from "~/state/selectors";
import { RawState, Pos } from "~/types";
import { createEntityFromTemplate } from "~/utils/entities";
import { registerHandler } from "~state/handleAction";
import { findValidPositions } from "~utils/building";
import WrappedState from "~types/WrappedState";
import { areConditionsMet } from "~utils/conditions";
import { arePositionsEqual } from "~utils/geometry";
import colors from "~colors";

function activatePlacement(
  state: WrappedState,
  action: ReturnType<typeof actions.activatePlacement>,
): void {
  const player = state.select.player();
  if (!player) return;

  const placingTarget = state.select.placingTarget();
  if (placingTarget) {
    state.act.cancelPlacement();
  }

  const { cost, takesTurn, template, validitySelector } = action.payload;

  if (cost && !state.select.canAffordToPay(cost.resource, cost.amount)) {
    const message = `You do not have enough ${
      cost.resource
    }. You have ${state.select.resource(cost.resource)} out of ${
      cost.amount
    } required`;
    state.act.logMessage({ message });
    return;
  }

  const entityToPlace = createEntityFromTemplate(template, {
    placing: { takesTurn, cost, validitySelector },
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
        projectors
          .filter((projector) =>
            areConditionsMet(state, projector, projector.projector.condition),
          )
          .map((projector) => ({
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

  const targetPos = action.payload.pos || player.pos;
  const targetPosIsValid = validPositions.some((p) =>
    arePositionsEqual(p, targetPos),
  );
  state.act.addEntity({
    ...entityToPlace,
    pos: targetPos,
    display: entityToPlace.display && {
      ...entityToPlace.display,
      color: targetPosIsValid ? colors.secondary : colors.invalid,
    },
  });
  for (const pos of validPositions) {
    state.act.addEntity(createEntityFromTemplate("VALID_MARKER", { pos }));
  }
}

registerHandler(activatePlacement, actions.activatePlacement);
