import * as actions from "~/state/actions";
import * as selectors from "~/state/selectors";
import { GameState, Entity } from "~/types";
import { attack } from "./attack";
import { playerTookTurn } from "./playerTookTurn";
import { removeEntities } from "./removeEntities";
import { updateEntity } from "./updateEntity";

export function fireWeapon(
  state: GameState,
  action: ReturnType<typeof actions.fireWeapon>,
) {
  let newState = state;
  const activeWeapon = selectors.activeWeapon(newState);
  const player = selectors.player(newState);
  if (!player || !activeWeapon) return newState;

  const targetingLasers = selectors.targetingLasers(newState);

  const entitiesToSwap: Entity[] = [player];
  const entitiesToRemove: string[] = [];
  const entitiesToAttack: string[] = [];
  for (const laser of targetingLasers) {
    const { pos } = laser;
    const entitiesAtPos = selectors.entitiesAtPosition(newState, pos);
    for (const entity of entitiesAtPos) {
      if (entity.destructible && activeWeapon.weapon.type === "TELEPORT") {
        entitiesToSwap.push(entity);
      } else if (entity.conductive && activeWeapon.weapon.type === "ELECTRIC") {
        if (entity.destructible) {
          entitiesToRemove.push(entity.id);
        } else {
          entitiesToAttack.push(entity.id);
        }
      } else if (entity.destructible) {
        entitiesToRemove.push(entity.id);
      } else if (entity.hitPoints) {
        entitiesToAttack.push(entity.id);
      }
    }
  }

  newState = removeEntities(
    newState,
    actions.removeEntities({
      entityIds: [
        ...targetingLasers.map(e => e.id),
        ...new Set(entitiesToRemove),
      ],
    }),
  );

  for (const id of [...new Set(entitiesToAttack)]) {
    newState = attack(
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
      newState = updateEntity(
        newState,
        actions.updateEntity({
          id: entity.id,
          pos: positions[(index + 1) % positions.length],
        }),
      );
    });
  }

  newState = updateEntity(
    newState,
    actions.updateEntity({
      id: activeWeapon.id,
      weapon: {
        ...activeWeapon.weapon,
        readyIn: activeWeapon.weapon.cooldown + 1,
        active: false,
      },
    }),
  );

  newState = playerTookTurn(newState, actions.playerTookTurn());
  return newState;
}
