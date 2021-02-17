import { createStandardAction } from "typesafe-actions";
import { registerHandler } from "~state/handleAction";
import WrappedState from "~types/WrappedState";

const clearReflectors = createStandardAction("CLEAR_REFLECTORS")();
export default clearReflectors;

function clearReflectorsHandler(
  state: WrappedState,
  action: ReturnType<typeof clearReflectors>,
): void {
  const reflectors = state.select.entitiesWithComps("reflector", "pos");
  reflectors.forEach((reflector) => {
    state.act.removeReflector(reflector.pos);
  });
}

registerHandler(clearReflectorsHandler, clearReflectors);
