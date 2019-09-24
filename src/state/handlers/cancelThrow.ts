import * as actions from "~/state/actions";
import * as selectors from "~/state/selectors";
import { GameState } from "~/types";
import handleAction, { registerHandler } from "~state/handleAction";

function cancelThrow(
  state: GameState,
  action: ReturnType<typeof actions.cancelThrow>,
): GameState {
  let newState = state;
  newState = handleAction(
    newState,
    actions.removeEntities({
      entityIds: selectors
        .entityList(newState)
        .filter(e => e.fov)
        .map(e => e.id),
    }),
  );
  const entity = selectors.throwingTarget(newState);
  if (!entity) return newState;
  newState = handleAction(
    newState,
    actions.removeEntity({ entityId: entity.id }),
  );
  return newState;
}

registerHandler(cancelThrow, actions.cancelThrow);
