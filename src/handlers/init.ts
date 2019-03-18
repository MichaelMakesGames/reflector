import nanoid from "nanoid";
import * as actions from "../actions";
import { getLevels } from "../levels";
import makeLevel from "../makeLevel";
import { createEntityFromTemplate } from "../templates";
import { GameState } from "../types";
import { addEntity } from "./addEntity";

export function init(
  state: GameState,
  action: ReturnType<typeof actions.init>,
): GameState {
  const levels = getLevels();
  for (let level of levels) {
    state = addEntity(
      state,
      actions.addEntity({ entity: { id: nanoid(), level } }),
    );
  }

  state = addEntity(
    state,
    actions.addEntity({
      entity: createEntityFromTemplate("PLAYER"),
    }),
  );
  const startingWeapon = createEntityFromTemplate("WEAPON_LASER");
  if (startingWeapon.weapon) startingWeapon.weapon.slot = 1;
  state = addEntity(state, actions.addEntity({ entity: startingWeapon }));

  state = makeLevel(state);
  return state;
}
