import * as actions from "../actions";
import * as selectors from "../selectors";
import { GameState } from "../types";
import { addEntity } from "./addEntity";
import { removeEntity } from "./removeEntity";

export function executeEquip(
  state: GameState,
  action: ReturnType<typeof actions.executeEquip>,
) {
  const equipping = selectors.entityList(state).filter(e => e.equipping)[0];
  if (!equipping || !equipping.equipping || !equipping.weapon) return state;

  const { slot } = action.payload;
  if (slot) {
    const weaponInSlot = selectors.weaponInSlot(state, slot);
    if (weaponInSlot) {
      state = removeEntity(
        state,
        actions.removeEntity({ entityId: weaponInSlot.id }),
      );
    }
    state = addEntity(
      state,
      actions.addEntity({
        entity: {
          ...equipping,
          equipping: undefined,
          position: undefined,
          weapon: {
            ...equipping.weapon,
            slot,
          },
        },
      }),
    );
    state = {
      ...state,
      messageLog: [...state.messageLog, `Equipped to slot ${slot}.`],
    };
  } else {
    state = {
      ...state,
      messageLog: [...state.messageLog, "Discarded."],
    };
  }
  return state;
}
