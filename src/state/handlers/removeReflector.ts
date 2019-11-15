import * as actions from "~state/actions";
import * as selectors from "~state/selectors";
import { GameState } from "~types";
import handleAction, { registerHandler } from "~state/handleAction";

function removeReflector(
  state: GameState,
  action: ReturnType<typeof actions.removeReflector>,
): GameState {
  const placingTarget = selectors.placingTarget(state);
  if (!placingTarget) return state;
  const entitiesAtPosition = selectors.entitiesAtPosition(
    state,
    placingTarget.pos,
  );
  const otherReflector = entitiesAtPosition.find(
    e => e.reflector && e !== placingTarget,
  );
  if (!otherReflector) {
    return {
      ...state,
      messageLog: [...state.messageLog, "No reflector to remove."],
    };
  } else {
    return handleAction(
      state,
      actions.removeEntity({ entityId: otherReflector.id }),
    );
  }
}

registerHandler(removeReflector, actions.removeReflector);
