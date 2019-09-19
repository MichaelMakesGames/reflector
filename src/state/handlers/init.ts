import * as actions from "~/state/actions";
import { createEntityFromTemplate } from "~/utils/entities";
import makeLevel from "~/utils/makeLevel";

import { GameState } from "~/types";
import { addEntity } from "./addEntity";
import { PLAYER_ID } from "~/constants";

export function init(
  state: GameState,
  action: ReturnType<typeof actions.init>,
): GameState {
  let newState = state;

  newState = addEntity(
    newState,
    actions.addEntity({
      entity: {
        ...createEntityFromTemplate("PLAYER"),
        id: PLAYER_ID,
      },
    }),
  );
  const startingWeapon = createEntityFromTemplate("WEAPON_LASER");
  if (startingWeapon.weapon) startingWeapon.weapon.slot = 1;
  newState = addEntity(newState, actions.addEntity({ entity: startingWeapon }));

  newState = makeLevel(newState);
  return newState;
}
