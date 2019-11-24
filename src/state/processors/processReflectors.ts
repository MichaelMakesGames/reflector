import { GameState } from "~types";
import selectors from "~state/selectors";
import actions from "~state/actions";
import handleAction from "~state/handleAction";
import { getDistance } from "~utils/geometry";

export default function processReflectors(oldState: GameState): GameState {
  let state = oldState;
  const reflectors = selectors.entitiesWithComps(state, "reflector", "pos");
  const projectors = selectors.entitiesWithComps(state, "projector", "pos");
  for (const reflector of reflectors) {
    if (selectors.isPositionBlocked(state, reflector.pos)) {
      state = handleAction(
        state,
        actions.removeEntity({ entityId: reflector.id }),
      );
    }

    if (
      projectors.every(
        projector =>
          getDistance(projector.pos, reflector.pos) > projector.projector.range,
      )
    ) {
      state = handleAction(
        state,
        actions.removeEntity({ entityId: reflector.id }),
      );
    }
  }
  return state;
}
