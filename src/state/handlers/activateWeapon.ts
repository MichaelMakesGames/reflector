import actions from "~/state/actions";
import { registerHandler } from "~state/handleAction";
import WrappedState from "~types/WrappedState";

function activateWeapon(
  state: WrappedState,
  action: ReturnType<typeof actions.activateWeapon>,
): void {
  const weaponEntity = state.select.entitiesWithComps("weapon")[0];
  if (!weaponEntity) return;

  const { weapon } = weaponEntity;
  state.act.updateEntity({
    ...weaponEntity,
    weapon: {
      ...weapon,
      active: !weapon.active,
    },
  });

  state.act.targetWeapon(state.select.lastAimingDirection());
}

registerHandler(activateWeapon, actions.activateWeapon);
