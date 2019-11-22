import * as actions from "~state/actions";
import * as selectors from "~state/selectors";
import { GameState } from "~types";
import handleAction, { registerHandler } from "~state/handleAction";
import { createEntityFromTemplate } from "~utils/entities";
import colors from "~colors";
import { arePositionsEqual } from "~utils/geometry";

function removeReflector(
  prevState: GameState,
  action: ReturnType<typeof actions.removeReflector>,
): GameState {
  let state = prevState;
  const pos = action.payload;
  const placingTarget = selectors.placingTarget(state);
  const placingMarker = selectors.placingMarker(state);
  if (!placingTarget || !placingMarker) return state;
  const entitiesAtPosition = selectors.entitiesAtPosition(state, pos);
  const otherReflector = entitiesAtPosition.find(
    e => e.reflector && e !== placingTarget,
  );
  if (!otherReflector) {
    return {
      ...state,
      messageLog: [...state.messageLog, "No reflector to remove."],
    };
  } else {
    state = handleAction(
      state,
      actions.removeEntity({ entityId: otherReflector.id }),
    );
    state = handleAction(
      state,
      actions.addEntity({
        entity: createEntityFromTemplate("VALID_MARKER", {
          pos: otherReflector.pos,
        }),
      }),
    );
    if (arePositionsEqual(pos, placingMarker.pos)) {
      state = handleAction(
        state,
        actions.updateEntity({
          ...placingMarker,
          display: {
            ...placingMarker.display,
            color: colors.secondary,
          },
        }),
      );
    }
    return state;
  }
}

registerHandler(removeReflector, actions.removeReflector);
