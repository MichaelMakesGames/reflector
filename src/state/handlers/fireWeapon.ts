import * as actions from "~/state/actions";
import * as selectors from "~/state/selectors";
import { Entity, GameState } from "~/types";
import handleAction, { registerHandler } from "~state/handleAction";

function fireWeapon(
  state: GameState,
  action: ReturnType<typeof actions.fireWeapon>,
) {
  let newState = state;
  const activeWeapon = selectors.activeWeapon(newState);
  const player = selectors.player(newState);
  if (!player || !activeWeapon) return newState;

  const targetingLasers = selectors.targetingLasers(newState);

  const entitiesToSwap: Entity[] = [player];
  const entitiesToDestroy: string[] = [];
  const entitiesToAttack: string[] = [];
  for (const laser of targetingLasers) {
    const { pos } = laser;
    const entitiesAtPos = selectors.entitiesAtPosition(newState, pos);
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

  newState = handleAction(
    newState,
    actions.removeEntities({
      entityIds: [...targetingLasers.map(e => e.id)],
    }),
  );

  for (const id of new Set(entitiesToDestroy)) {
    newState = handleAction(newState, actions.destroy({ entityId: id }));
  }

  for (const id of [...new Set(entitiesToAttack)]) {
    newState = handleAction(
      newState,
      actions.attack({
        target: id,
        message: "You take damage from your own attack...",
      }),
    );
  }

  if (entitiesToSwap.length > 1) {
    const positions = entitiesToSwap.map(e => e.pos);
    entitiesToSwap.forEach((entity, index) => {
      newState = handleAction(
        newState,
        actions.updateEntity({
          id: entity.id,
          pos: positions[(index + 1) % positions.length],
        }),
      );
    });
  }

  newState = handleAction(
    newState,
    actions.updateEntity({
      id: activeWeapon.id,
      weapon: {
        ...activeWeapon.weapon,
        active: false,
      },
    }),
  );

  newState = handleAction(newState, actions.playerTookTurn());
  return newState;
}

registerHandler(fireWeapon, actions.fireWeapon);
