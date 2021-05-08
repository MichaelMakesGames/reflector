import { createStandardAction } from "typesafe-actions";
import { registerHandler } from "~state/handleAction";
import WrappedState from "~types/WrappedState";
import audio from "~lib/audio";

const deactivateWeapon = createStandardAction("DEACTIVATE_WEAPON")();
export default deactivateWeapon;

function deactivateWeaponHandler(
  state: WrappedState,
  action: ReturnType<typeof deactivateWeapon>,
): void {
  if (state.raw.laserState === "ACTIVE") {
    state.setRaw({
      ...state.raw,
      laserState: "READY",
    });
    state.act.removeEntities(
      state.select.entitiesWithComps("laser").map((e) => e.id),
    );
    audio.stop("laser_active");
    audio.play("laser_cancel");
  }
}

registerHandler(deactivateWeaponHandler, deactivateWeapon);
