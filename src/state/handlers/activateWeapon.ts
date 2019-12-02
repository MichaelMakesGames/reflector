import actions from "~/state/actions";
import { registerHandler } from "~state/handleAction";
import WrappedState from "~types/WrappedState";

function activateWeapon(
  state: WrappedState,
  action: ReturnType<typeof actions.activateWeapon>,
): void {
  state.setRaw({ ...state.raw, isWeaponActive: true });
  state.act.targetWeapon(state.select.lastAimingDirection());
}

registerHandler(activateWeapon, actions.activateWeapon);
