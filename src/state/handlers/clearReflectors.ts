import actions from "~state/actions";
import { registerHandler } from "~state/handleAction";
import WrappedState from "~types/WrappedState";

function clearReflectors(
  state: WrappedState,
  action: ReturnType<typeof actions.clearReflectors>,
): void {
  const reflectors = state.select
    .entitiesWithComps("reflector", "pos")
    .filter((reflector) => !reflector.placing);
  reflectors.forEach((reflector) => {
    state.act.removeReflector(reflector.pos);
  });
}

registerHandler(clearReflectors, actions.clearReflectors);
