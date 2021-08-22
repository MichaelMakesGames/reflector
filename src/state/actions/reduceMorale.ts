import { createAction } from "typesafe-actions";
import { registerHandler } from "../handleAction";
import WrappedState from "../../types/WrappedState";

const reduceMorale = createAction("REDUCE_MORALE")<{
  amount: number;
}>();
export default reduceMorale;

function reduceMoraleHandler(
  state: WrappedState,
  action: ReturnType<typeof reduceMorale>
): void {
  state.setRaw({
    ...state.raw,
    morale: state.raw.morale - action.payload.amount,
  });
}

registerHandler(reduceMoraleHandler, reduceMorale);
