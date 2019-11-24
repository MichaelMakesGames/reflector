import actions from "~/state/actions";
import { Entity } from "~/types";
import { registerHandler } from "~state/handleAction";
import WrappedState from "~types/WrappedState";

function fireWeapon(
  state: WrappedState,
  action: ReturnType<typeof actions.fireWeapon>,
): void {
  const activeWeapon = state.select.activeWeapon();
  const player = state.select.player();
  if (!player || !activeWeapon) return;

  const targetingLasers = state.select.entitiesWithComps("targeting", "pos");

  const entitiesToSwap: Entity[] = [player];
  const entitiesToDestroy: string[] = [];
  const entitiesToAttack: string[] = [];
  for (const laser of targetingLasers.filter(
    entity => !entity.targeting.cosmetic,
  )) {
    const { pos } = laser;
    const entitiesAtPos = state.select.entitiesAtPosition(pos);
    for (const entity of entitiesAtPos) {
      if (entity.destructible && activeWeapon.weapon.type === "TELEPORT") {
        entitiesToSwap.push(entity);
      } else if (entity.conductive && activeWeapon.weapon.type === "ELECTRIC") {
        if (entity.destructible) {
          entitiesToDestroy.push(entity.id);
        } else {
          entitiesToAttack.push(entity.id);
        }
      } else if (entity.destructible) {
        entitiesToDestroy.push(entity.id);
      }
    }
  }

  state.act.removeEntities({
    entityIds: [...targetingLasers.map(e => e.id)],
  });

  for (const id of new Set(entitiesToDestroy)) {
    state.act.destroy({ entityId: id });
  }

  for (const id of [...new Set(entitiesToAttack)]) {
    state.act.attack({
      target: id,
      message: "You take damage from your own attack...",
    });
  }

  if (entitiesToSwap.length > 1) {
    const positions = entitiesToSwap.map(e => e.pos);
    entitiesToSwap.forEach((entity, index) => {
      state.act.updateEntity({
        id: entity.id,
        pos: positions[(index + 1) % positions.length],
      });
    });
  }

  state.act.updateEntity({
    id: activeWeapon.id,
    weapon: {
      ...activeWeapon.weapon,
      active: false,
    },
  });

  state.act.playerTookTurn();
}

registerHandler(fireWeapon, actions.fireWeapon);
