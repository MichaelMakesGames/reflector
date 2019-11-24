import actions from "~/state/actions";
import * as selectors from "~/state/selectors";
import { GameState } from "~/types";
import handleAction, { registerHandler } from "~state/handleAction";

function cancelPlacement(
  prevState: GameState,
  action: ReturnType<typeof actions.cancelPlacement>,
): GameState {
  let state = prevState;
  state = handleAction(
    state,
    actions.removeEntities({
      entityIds: selectors
        .entityList(state)
        .filter(e => e.validMarker)
        .map(e => e.id),
    }),
  );
  const entity = selectors.placingTarget(state);
  const marker = selectors.placingMarker(state);
  if (!entity || !marker) return state;
  state = handleAction(
    state,
    actions.removeEntities({ entityIds: [entity.id, marker.id] }),
  );
  return state;
}

registerHandler(cancelPlacement, actions.cancelPlacement);
