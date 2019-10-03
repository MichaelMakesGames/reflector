import { GameState } from "~types";
import * as selectors from "~state/selectors";
import * as actions from "~state/actions";
import handleAction from "~state/handleAction";

export default function processReflectors(oldState: GameState): GameState {
  let state = oldState;
  const reflectors = selectors.entitiesWithComps(state, "reflector", "pos");
  for (const reflector of reflectors) {
    if (selectors.isPositionBlocked(state, reflector.pos)) {
      state = handleAction(
        state,
        actions.removeEntity({ entityId: reflector.id }),
      );
    }
  }
  return state;
}
