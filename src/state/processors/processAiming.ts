import WrappedState from "~types/WrappedState";

export default function processAiming(state: WrappedState) {
  if (state.select.isWeaponActive()) {
    state.act.targetWeapon(state.select.lastAimingDirection());
  }
}
