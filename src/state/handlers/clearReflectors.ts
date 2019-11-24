import actions from "~state/actions";
import * as selectors from "~state/selectors";
import { GameState } from "~types";
import handleAction, { registerHandler } from "~state/handleAction";

function clearReflectors(
  prevState: GameState,
  action: ReturnType<typeof actions.clearReflectors>,
): GameState {
  let state = prevState;

  const reflectors = selectors
    .entitiesWithComps(state, "reflector", "pos")
    .filter(reflector => !reflector.placing);
  reflectors.forEach(reflector => {
    state = handleAction(state, actions.removeReflector(reflector.pos));
  });

  return state;
}

registerHandler(clearReflectors, actions.clearReflectors);
