import * as actions from "../actions";
import * as selectors from "../selectors";
import { GameState } from "../../types";
import { removeEntity } from "./removeEntity";
import { updateEntity } from "./updateEntity";

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
    state = updateEntity(
      state,
      actions.updateEntity({
        id: equipping.id,
        equipping: undefined,
        pos: undefined,
        weapon: {
          ...equipping.weapon,
          slot,
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
