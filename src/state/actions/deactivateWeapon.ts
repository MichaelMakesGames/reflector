import { createAction } from "typesafe-actions";
import { registerHandler } from "../handleAction";
import WrappedState from "../../types/WrappedState";
import { PLAYER_ID } from "../../constants";

const deactivateWeapon = createAction("DEACTIVATE_WEAPON")();
export default deactivateWeapon;

function deactivateWeaponHandler(
  state: WrappedState,
  action: ReturnType<typeof deactivateWeapon>
): void {
  const laserState = state.select.laserState();
  if (["ACTIVE", "FIRING"].includes(laserState)) {
    state.act.removeEntities(
      state.select
        .entitiesWithComps("laser")
        .filter((e) => e.laser.source === PLAYER_ID)
        .map((e) => e.id)
    );
    if (state.select.entitiesWithComps("laser").length === 0) {
      state.audio.stop("laser_active");
    }
    if (laserState === "ACTIVE") {
      state.setRaw({
        ...state.raw,
        laserState: "READY",
      });
      state.audio.play("laser_cancel");
    }
  }
  state.act.bordersUpdate();
}

registerHandler(deactivateWeaponHandler, deactivateWeapon);
