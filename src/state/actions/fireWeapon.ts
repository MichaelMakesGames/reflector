import { createStandardAction } from "typesafe-actions";
import { registerHandler } from "~state/handleAction";
import WrappedState from "~types/WrappedState";
import audio from "~lib/audio";

const fireWeapon = createStandardAction("FIRE_WEAPON")();
export default fireWeapon;

function fireWeaponHandler(
  state: WrappedState,
  action: ReturnType<typeof fireWeapon>,
): void {
  if (!state.select.isWeaponActive()) return;
  if (!state.select.player()) return;

  const lasers = state.select.entitiesWithComps("laser", "pos");

  const entitiesToDestroy: string[] = [];
  for (const laser of lasers.filter((entity) => !entity.laser.cosmetic)) {
    const { pos } = laser;
    const entitiesAtPos = state.select.entitiesAtPosition(pos);
    for (const entity of entitiesAtPos) {
      if (
        entity.destructible &&
        entitiesAtPos.some((e) => e.blocking && e.blocking.lasers)
      ) {
        entitiesToDestroy.push(entity.id);
      }
    }
  }

  for (const id of new Set(entitiesToDestroy)) {
    state.act.destroy(id);
  }

  state.act.deactivateWeapon();
  state.setRaw({
    ...state.raw,
    laserState: "FIRING",
  });
  state.act.playerTookTurn();

  audio.stop("aiming");
}

registerHandler(fireWeaponHandler, fireWeapon);
