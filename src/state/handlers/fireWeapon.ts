import * as actions from "../actions";
import * as selectors from "../selectors";
import { GameState } from "../../types";
import { attack } from "./attack";
import { playerTookTurn } from "./playerTookTurn";
import { removeEntities } from "./removeEntities";
import { updateEntity } from "./updateEntity";

export function fireWeapon(
  state: GameState,
  action: ReturnType<typeof actions.fireWeapon>,
) {
  const activeWeapon = selectors.activeWeapon(state);
  const player = selectors.player(state);
  if (!player || !player.position || !activeWeapon || !activeWeapon.weapon)
    return state;

  const targetingLasers = selectors.targetingLasers(state);

  const entitiesToSwap = [player];
  const entitiesToRemove: string[] = [];
  const entitiesToAttack: string[] = [];
  for (const laser of targetingLasers) {
    const { position } = laser;
    if (position) {
      const entitiesAtPos = selectors.entitiesAtPosition(state, position);
      for (let entity of entitiesAtPos) {
        if (entity.destructible && activeWeapon.weapon.type === "TELEPORT") {
          entitiesToSwap.push(entity);
        } else if (
          entity.conductive &&
          activeWeapon.weapon.type === "ELECTRIC"
        ) {
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
  }

  state = removeEntities(
    state,
    actions.removeEntities({
      entityIds: [
        ...targetingLasers.map(e => e.id),
        ...new Set(entitiesToRemove),
      ],
    }),
  );

  for (let id of [...new Set(entitiesToAttack)]) {
    state = attack(
      state,
      actions.attack({
        target: id,
        message: "You take damage from your own attack...",
      }),
    );
  }

  if (entitiesToSwap.length > 1) {
    const positions = entitiesToSwap.map(e => e.position);
    entitiesToSwap.forEach((entity, index) => {
      state = updateEntity(
        state,
        actions.updateEntity({
          id: entity.id,
          position: positions[(index + 1) % positions.length],
        }),
      );
    });
  }

  state = updateEntity(
    state,
    actions.updateEntity({
      id: activeWeapon.id,
      weapon: {
        ...activeWeapon.weapon,
        readyIn: activeWeapon.weapon.cooldown + 1,
        active: false,
      },
    }),
  );

  state = playerTookTurn(state, actions.playerTookTurn());
  return state;
}
