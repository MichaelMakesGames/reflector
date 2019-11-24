import actions from "~/state/actions";
import selectors from "~/state/selectors";
import { GameState } from "~/types";
import handleAction, { registerHandler } from "~state/handleAction";

function activateWeapon(
  state: GameState,
  action: ReturnType<typeof actions.activateWeapon>,
): GameState {
  let newState = state;
  const weaponInSlot = selectors.entitiesWithComps(newState, "weapon")[0];
  if (!weaponInSlot) return newState;

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
