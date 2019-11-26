import WrappedState from "~types/WrappedState";
import actions from "~state/actions";
import { registerHandler } from "~state/handleAction";

function modifyResource(
  state: WrappedState,
  action: ReturnType<typeof actions.modifyResource>,
): void {
  const { resource, amount } = action.payload;
  state.setRaw({
    ...state.raw,
    resources: {
      ...state.raw.resources,
      [resource]: (state.raw.resources[resource] || 0) + amount,
    },
  });
}

registerHandler(modifyResource, actions.modifyResource);
