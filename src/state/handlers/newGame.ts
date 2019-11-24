import actions from "~/state/actions";
import { createEntityFromTemplate } from "~/utils/entities";
import makeLevel from "~/utils/makeLevel";

import { GameState } from "~/types";
import handleAction, { registerHandler } from "~state/handleAction";
import initialState from "~state/initialState";
import { clearRenderer } from "~renderer";

function init(
  state: GameState,
  action: ReturnType<typeof actions.newGame>,
): GameState {
  let newState = initialState;
  clearRenderer();

  const startingWeapon = createEntityFromTemplate("WEAPON_LASER");
  if (startingWeapon.weapon) startingWeapon.weapon.slot = 1;
  newState = handleAction(
    newState,
    actions.addEntity({ entity: startingWeapon }),
  );

  newState = makeLevel(newState);
  return newState;
}

registerHandler(init, actions.newGame);
