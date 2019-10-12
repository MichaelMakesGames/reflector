import * as actions from "~state/actions";
import * as selectors from "~state/selectors";
import { GameState } from "~types";
import handleAction, { registerHandler } from "~state/handleAction";

function clearReflectors(
  prevState: GameState,
  action: ReturnType<typeof actions.clearReflectors>,
): GameState {
  let state = prevState;

  const reflectors = selectors.entitiesWithComps(state, "reflector");

  state = handleAction(
    state,
    actions.removeEntities({ entityIds: reflectors.map(e => e.id) }),
  );

  return state;
}

registerHandler(clearReflectors, actions.clearReflectors);
