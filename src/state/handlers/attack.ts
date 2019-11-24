import actions from "~/state/actions";
import { registerHandler } from "~state/handleAction";
import WrappedState from "~types/WrappedState";

function attack(
  state: WrappedState,
  action: ReturnType<typeof actions.attack>,
): void {
  const target = state.select.entityById(action.payload.target);

  if (target.destructible) {
    state.act.destroy({ entityId: target.id });
  }
}

registerHandler(attack, actions.attack);
