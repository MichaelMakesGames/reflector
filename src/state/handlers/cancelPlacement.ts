import * as actions from "~/state/actions";
import * as selectors from "~/state/selectors";
import { GameState } from "~/types";
import handleAction, { registerHandler } from "~state/handleAction";

function cancelPlacement(
  state: GameState,
  action: ReturnType<typeof actions.cancelPlacement>,
): GameState {
  let newState = state;
  newState = handleAction(
    newState,
    actions.removeEntities({
      entityIds: selectors
        .entityList(newState)
        .filter(e => e.validMarker)
        .map(e => e.id),
    }),
  );
  const entity = selectors.placingTarget(newState);
  if (!entity) return newState;
  newState = handleAction(
    newState,
    actions.removeEntity({ entityId: entity.id }),
  );
  return newState;
}

registerHandler(cancelPlacement, actions.cancelPlacement);
