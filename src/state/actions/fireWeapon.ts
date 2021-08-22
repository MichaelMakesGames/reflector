import { RNG } from "rot-js";
import { createAction } from "typesafe-actions";
import audio from "../../lib/audio";
import { registerHandler } from "../handleAction";
import WrappedState from "../../types/WrappedState";

const fireWeapon = createAction("FIRE_WEAPON")();
export default fireWeapon;

function fireWeaponHandler(
  state: WrappedState,
  action: ReturnType<typeof fireWeapon>
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

  state.setRaw({
    ...state.raw,
    laserState: "FIRING",
  });
  state.act.deactivateWeapon();

  audio.stop("laser_active");
  audio.play(
    RNG.getItem([
      "laser_shot_1",
      "laser_shot_2",
      "laser_shot_3",
      // "laser_shot_4",
      // "laser_shot_5",
      // "laser_shot_6",
    ]) || ""
  );

  state.act.playerTookTurn();
}

registerHandler(fireWeaponHandler, fireWeapon);
