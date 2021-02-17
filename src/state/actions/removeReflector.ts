import { createStandardAction } from "typesafe-actions";
import { registerHandler } from "~state/handleAction";
import { Pos } from "~types";
import WrappedState from "~types/WrappedState";

const removeReflector = createStandardAction("REMOVE_REFLECTOR")<Pos>();
export default removeReflector;

function removeReflectorHandler(
  state: WrappedState,
  action: ReturnType<typeof removeReflector>,
): void {
  const pos = action.payload;
  const entitiesAtPosition = state.select.entitiesAtPosition(pos);
  const reflector = entitiesAtPosition.find((e) => e.reflector);

  if (reflector) {
    state.act.removeEntity(reflector.id);
  }
}

registerHandler(removeReflectorHandler, removeReflector);
