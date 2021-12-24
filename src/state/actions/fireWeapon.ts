import { RNG } from "rot-js";
import { createAction } from "typesafe-actions";
import { registerHandler } from "../handleAction";
import WrappedState from "../../types/WrappedState";
import { PLAYER_ID } from "../../constants";
import { fromPosKey, getPosKey } from "../../lib/geometry";

const fireWeapon = createAction("FIRE_WEAPON")<{ source: string }>();
export default fireWeapon;

function fireWeaponHandler(
  state: WrappedState,
  action: ReturnType<typeof fireWeapon>
): void {
  const isPlayer = action.payload.source === PLAYER_ID;
  if (isPlayer) {
    if (!state.select.isWeaponActive()) return;
    if (!state.select.player()) return;
  }

  const lasers = state.select
    .entitiesWithComps("laser", "pos")
    .filter((e) => e.laser.source === action.payload.source);

  state.renderer.flashGlowAndRemoveGroup(lasers[0].display?.group?.id || "");

  const positionsToDestroy: string[] = [];
  for (const laser of lasers.filter((entity) => !entity.laser.cosmetic)) {
    const { pos } = laser;
    const entitiesAtPos = state.select.entitiesAtPosition(pos);
    for (const entity of entitiesAtPos) {
      if (entity.absorber) {
        state.act.updateEntity({
          id: entity.id,
          absorber: {
            ...entity.absorber,
            charged: true,
          },
        });
      } else if (
        entity.destructible &&
        entitiesAtPos.some((e) => e.blocking && e.blocking.lasers)
      ) {
        positionsToDestroy.push(getPosKey(entity.pos));
      }
    }
  }

  for (const posKey of new Set(positionsToDestroy)) {
    state.act.destroyPos({
      target: fromPosKey(posKey),
      from: fromPosKey(posKey),
    });
  }

  if (isPlayer) {
    state.setRaw({
      ...state.raw,
      laserState: "FIRING",
    });
    state.act.deactivateWeapon();
  } else {
    state.act.removeEntities(lasers.map((e) => e.id));
  }

  if (state.select.entitiesWithComps("laser").length === 0) {
    state.audio.stop("laser_active");
  }
  state.audio.play(
    RNG.getItem([
      "laser_shot_1",
      "laser_shot_2",
      "laser_shot_3",
      // "laser_shot_4",
      // "laser_shot_5",
      // "laser_shot_6",
    ]) || ""
  );

  if (isPlayer) {
    state.act.playerTookTurn();
  }
}

registerHandler(fireWeaponHandler, fireWeapon);
