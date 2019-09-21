import { getType } from "typesafe-actions";
import * as actions from "~state/actions";
import * as selectors from "~/state/selectors";
import { GameState } from "~types";
import { reduceMorale } from "./reduceMorale";
import { removeEntity } from "./removeEntity";

export function destroy(
  state: GameState,
  action: ReturnType<typeof actions.destroy>,
) {
  let newState = state;
  const { entityId } = action.payload;
  const entity = selectors.entity(newState, entityId);
  if (entity.destructible) {
    if (entity.destructible.onDestroy) {
      const action = entity.destructible.onDestroy(entity);
      if (action) {
        // TODO handle any type of action (including future actions)
        if (action.type === getType(actions.reduceMorale)) {
          newState = reduceMorale(newState, action);
        }
      }
    }
    newState = removeEntity(newState, actions.removeEntity({ entityId }));
  }
  return newState;
}
