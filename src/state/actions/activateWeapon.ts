import { createStandardAction } from "typesafe-actions";
import { registerHandler } from "~state/handleAction";
import WrappedState from "~types/WrappedState";

const activateWeapon = createStandardAction("ACTIVATE_WEAPON")();
export default activateWeaponHandler;

function activateWeaponHandler(
  state: WrappedState,
  action: ReturnType<typeof activateWeapon>,
): void {
  state.act.targetWeapon(state.select.lastAimingDirection());
}

registerHandler(activateWeaponHandler, activateWeapon);
