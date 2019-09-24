import * as actions from "~state/actions";
import * as selectors from "~/state/selectors";
import { GameState } from "~types";
import handleAction, { registerHandler } from "~state/handleAction";

function destroy(state: GameState, action: ReturnType<typeof actions.destroy>) {
  let newState = state;
  const { entityId } = action.payload;
  const entity = selectors.entityById(newState, entityId);
  if (entity.destructible) {
    if (entity.destructible.onDestroy) {
      const effectAction = entity.destructible.onDestroy(entity);
      if (effectAction) {
        newState = handleAction(newState, effectAction);
      }
    }
    newState = handleAction(newState, actions.removeEntity({ entityId }));
  }
  return newState;
}

registerHandler(destroy, actions.destroy);
