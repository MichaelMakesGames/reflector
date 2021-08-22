import { createAction } from "typesafe-actions";
import { ResourceCode } from "../../data/resources";
import { registerHandler } from "../handleAction";
import WrappedState from "../../types/WrappedState";
import { round } from "../../lib/math";

const modifyResource = createAction("MODIFY_RESOURCE")<{
  resource: ResourceCode;
  amount: number;
  reason: string;
}>();
export default modifyResource;

function modifyResourceHandler(
  state: WrappedState,
  action: ReturnType<typeof modifyResource>
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
        (change) => change.reason === reason
      )
        ? state.raw.resourceChangesThisTurn[resource].map((change) =>
            change.reason === reason
              ? { reason, amount: change.amount + amount }
              : change
          )
        : [...state.raw.resourceChangesThisTurn[resource], { reason, amount }],
    },
  });
}

registerHandler(modifyResourceHandler, modifyResource);
