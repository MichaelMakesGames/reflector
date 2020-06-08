import actions from "~/state/actions";
import { registerHandler } from "~state/handleAction";
import WrappedState from "~types/WrappedState";
import { ResourceCode } from "~data/resources";

function fireWeapon(
  state: WrappedState,
  action: ReturnType<typeof actions.fireWeapon>,
): void {
  const player = state.select.player();
  if (!player) return;

  const lasers = state.select.entitiesWithComps("laser", "pos");

  if (state.select.canAffordToPay(ResourceCode.Power, 1)) {
    state.act.modifyResource({
      resource: ResourceCode.Power,
      amount: -1,
      reason: "Fired Laser",
    });
  }

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
  state.act.playerTookTurn();
}

registerHandler(fireWeapon, actions.fireWeapon);
