import * as actions from "~/state/actions";
import * as selectors from "~/state/selectors";
import { GameState } from "~/types";
import handleAction, { registerHandler } from "~state/handleAction";

function activateWeapon(
  state: GameState,
  action: ReturnType<typeof actions.activateWeapon>,
): GameState {
  let newState = state;
  const weaponInSlot = selectors.weaponInSlot(newState, action.payload.slot);
  if (!weaponInSlot) return newState;

  for (const weapon of selectors.weapons(newState)) {
    if (weapon !== weaponInSlot && weapon.weapon && weapon.weapon.active) {
      newState = handleAction(
        newState,
        actions.updateEntity({
          id: weapon.id,
          weapon: {
            ...weapon.weapon,
            active: false,
          },
        }),
      );
    }
  }

  const entity = weaponInSlot;
  const { weapon } = entity;
  if (!weapon) return newState;
  newState = {
    ...newState,
    entities: {
      ...newState.entities,
      [entity.id]: {
        ...entity,
        weapon: {
          ...weapon,
          active: !weapon.active,
        },
      },
    },
  };
  newState = handleAction(
    newState,
    actions.targetWeapon(newState.lastAimingDirection),
  );
  return newState;
}

registerHandler(activateWeapon, actions.activateWeapon);
