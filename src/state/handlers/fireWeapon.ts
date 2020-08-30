import actions from "~/state/actions";
import { registerHandler } from "~state/handleAction";
import WrappedState from "~types/WrappedState";

function fireWeapon(
  state: WrappedState,
  action: ReturnType<typeof actions.fireWeapon>,
): void {
  if (!state.select.isWeaponActive()) return;
  if (!state.select.player()) return;

  state.act.playerWillTakeTurn();

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
}

registerHandler(fireWeapon, actions.fireWeapon);
