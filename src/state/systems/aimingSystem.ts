import WrappedState from "~types/WrappedState";

export default function aimingSystem(state: WrappedState) {
  if (state.select.isWeaponActive()) {
    state.act.targetWeapon(state.select.lastAimingDirection());
  }
}
