import actions from "~/state/actions";
import { registerHandler } from "~state/handleAction";
import WrappedState from "~types/WrappedState";

function fireWeapon(
  state: WrappedState,
  action: ReturnType<typeof actions.fireWeapon>,
): void {
  const player = state.select.player();
  if (!player) return;

  const lasers = state.select.entitiesWithComps("laser", "pos");

  const entitiesToDestroy: string[] = [];
  for (const laser of lasers.filter(entity => !entity.laser.cosmetic)) {
    const { pos } = laser;
    const entitiesAtPos = state.select.entitiesAtPosition(pos);
    for (const entity of entitiesAtPos) {
      if (entity.destructible) {
        entitiesToDestroy.push(entity.id);
      }
    }
  }

  for (const id of new Set(entitiesToDestroy)) {
    state.act.destroy(id);
  }

  state.act.deactivateWeapon();
  state.act.playerTookTurn();
}

registerHandler(fireWeapon, actions.fireWeapon);
