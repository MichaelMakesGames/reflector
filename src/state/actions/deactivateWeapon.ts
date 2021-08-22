import { createAction } from "typesafe-actions";
import { registerHandler } from "../handleAction";
import WrappedState from "../../types/WrappedState";
import audio from "../../lib/audio";

const deactivateWeapon = createAction("DEACTIVATE_WEAPON")();
export default deactivateWeapon;

function deactivateWeaponHandler(
  state: WrappedState,
  action: ReturnType<typeof deactivateWeapon>
): void {
  const laserState = state.select.laserState();
  if (["ACTIVE", "FIRING"].includes(laserState)) {
    state.act.removeEntities(
      state.select.entitiesWithComps("laser").map((e) => e.id)
    );
    audio.stop("laser_active");
    if (laserState === "ACTIVE") {
      state.setRaw({
        ...state.raw,
        laserState: "READY",
      });
      audio.play("laser_cancel");
    }
  }
}

registerHandler(deactivateWeaponHandler, deactivateWeapon);
