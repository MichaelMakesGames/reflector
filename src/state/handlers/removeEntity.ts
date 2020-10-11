import actions from "~/state/actions";
import { registerHandler } from "~state/handleAction";
import WrappedState from "~types/WrappedState";

function removeEntity(
  state: WrappedState,
  action: ReturnType<typeof actions.removeEntity>,
): void {
  state.act.removeEntities([action.payload]);
}

registerHandler(removeEntity, actions.removeEntity);
