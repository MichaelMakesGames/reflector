import actions from "~/state/actions";
import { createEntityFromTemplate } from "~/utils/entities";
import makeLevel from "~/utils/makeLevel";
import { clearRenderer } from "~renderer";
import { registerHandler } from "~state/handleAction";
import initialState from "~state/initialState";
import WrappedState from "~types/WrappedState";

function init(
  state: WrappedState,
  action: ReturnType<typeof actions.newGame>,
): void {
  state.setRaw(initialState);
  clearRenderer();

  const startingWeapon = createEntityFromTemplate("WEAPON_LASER");
  if (startingWeapon.weapon) startingWeapon.weapon.slot = 1;
  state.act.addEntity({ entity: startingWeapon });

  makeLevel(state);
}

registerHandler(init, actions.newGame);
