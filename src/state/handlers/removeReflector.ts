import actions from "~state/actions";
import { registerHandler } from "~state/handleAction";
import WrappedState from "~types/WrappedState";

function removeReflector(
  state: WrappedState,
  action: ReturnType<typeof actions.removeReflector>,
): void {
  const pos = action.payload;
  const entitiesAtPosition = state.select.entitiesAtPosition(pos);
  const reflector = entitiesAtPosition.find((e) => e.reflector);

  if (reflector) {
    state.act.removeEntity(reflector.id);
  }
}

registerHandler(removeReflector, actions.removeReflector);
