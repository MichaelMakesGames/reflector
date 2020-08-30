import WrappedState from "~types/WrappedState";
import actions from "~state/actions";
import { registerHandler } from "~state/handleAction";

function deactivateWeapon(
  state: WrappedState,
  action: ReturnType<typeof actions.deactivateWeapon>,
): void {
  if (state.raw.laserState === "ACTIVE") {
    state.setRaw({
      ...state.raw,
      laserState: "READY",
    });
    state.act.removeEntities(
      state.select.entitiesWithComps("laser").map((e) => e.id),
    );
  }
}

registerHandler(deactivateWeapon, actions.deactivateWeapon);
