import WrappedState from "~types/WrappedState";
import actions from "~state/actions";
import { registerHandler } from "~state/handleAction";
import { round } from "~utils/math";

function modifyResource(
  state: WrappedState,
  action: ReturnType<typeof actions.modifyResource>,
): void {
  const { resource, amount, reason } = action.payload;
  state.setRaw({
    ...state.raw,
    resources: {
      ...state.raw.resources,
      [resource]: round((state.raw.resources[resource] || 0) + amount, 1),
    },
    resourceChangesThisTurn: {
      ...state.raw.resourceChangesThisTurn,
      [resource]: state.raw.resourceChangesThisTurn[resource].some(
        (change) => change.reason === reason,
      )
        ? state.raw.resourceChangesThisTurn[resource].map((change) =>
            change.reason === reason
              ? { reason, amount: change.amount + amount }
              : change,
          )
        : [...state.raw.resourceChangesThisTurn[resource], { reason, amount }],
    },
  });
}

registerHandler(modifyResource, actions.modifyResource);
