import { PLAYER_ID } from "../../constants";
import WrappedState from "../../types/WrappedState";

export default function aimingSystem(state: WrappedState) {
  if (state.select.isWeaponActive()) {
    state.act.targetWeapon({
      direction: state.select.lastAimingDirection(),
      source: PLAYER_ID,
    });
  }
}
