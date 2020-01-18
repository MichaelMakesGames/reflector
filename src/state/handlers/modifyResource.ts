import WrappedState from "~types/WrappedState";
import actions from "~state/actions";
import { registerHandler } from "~state/handleAction";
import { round } from "~utils/math";

function modifyResource(
  state: WrappedState,
  action: ReturnType<typeof actions.modifyResource>,
): void {
  const { resource, amount } = action.payload;
  state.setRaw({
    ...state.raw,
    resources: {
      ...state.raw.resources,
      [resource]: round((state.raw.resources[resource] || 0) + amount, 1),
    },
  });
}

registerHandler(modifyResource, actions.modifyResource);
