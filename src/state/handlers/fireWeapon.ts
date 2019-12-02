import actions from "~/state/actions";
import { registerHandler } from "~state/handleAction";
import WrappedState from "~types/WrappedState";

function fireWeapon(
  state: WrappedState,
  action: ReturnType<typeof actions.fireWeapon>,
): void {
  const player = state.select.player();
  if (!player) return;

  const targetingLasers = state.select.entitiesWithComps("targeting", "pos");

  const entitiesToDestroy: string[] = [];
  for (const laser of targetingLasers.filter(
    entity => !entity.targeting.cosmetic,
  )) {
    const { pos } = laser;
    const entitiesAtPos = state.select.entitiesAtPosition(pos);
    for (const entity of entitiesAtPos) {
      if (entity.destructible) {
        entitiesToDestroy.push(entity.id);
      }
    }
  }

  for (const id of new Set(entitiesToDestroy)) {
    state.act.destroy({ entityId: id });
  }

  state.act.deactivateWeapon();
  state.act.playerTookTurn();
}

registerHandler(fireWeapon, actions.fireWeapon);
