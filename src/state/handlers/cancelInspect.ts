import { GameState } from "~types";
import actions from "../actions";
import * as selectors from "../selectors";
import handleAction, { registerHandler } from "~state/handleAction";

function cancelInspect(
  state: GameState,
  action: ReturnType<typeof actions.cancelInspect>,
) {
  const inspector = selectors.inspector(state);
  if (!inspector) return state;
  return handleAction(state, actions.removeEntity({ entityId: inspector.id }));
}

registerHandler(cancelInspect, actions.cancelInspect);
