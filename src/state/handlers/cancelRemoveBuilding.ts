import actions from "../actions";
import { registerHandler } from "~state/handleAction";
import WrappedState from "~types/WrappedState";

function cancelRemoveBuilding(
  state: WrappedState,
  action: ReturnType<typeof actions.cancelRemoveBuilding>,
): void {
  const removingMarker = state.select.removingMarker();
  if (!removingMarker) return;
  state.act.removeEntity(removingMarker.id);
}

registerHandler(cancelRemoveBuilding, actions.cancelRemoveBuilding);
