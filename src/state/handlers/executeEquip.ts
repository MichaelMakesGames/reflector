import * as actions from "../actions";
import * as selectors from "../selectors";
import { GameState } from "../../types";
import { removeEntity } from "./removeEntity";
import { updateEntity } from "./updateEntity";

export function executeEquip(
  state: GameState,
  action: ReturnType<typeof actions.executeEquip>,
) {
  let newState = state;
  const equipping = selectors.entityList(newState).filter(e => e.equipping)[0];
  if (!equipping || !equipping.equipping || !equipping.weapon) return newState;

  const { slot } = action.payload;
  if (slot) {
    const weaponInSlot = selectors.weaponInSlot(newState, slot);
    if (weaponInSlot) {
      newState = removeEntity(
        newState,
        actions.removeEntity({ entityId: weaponInSlot.id }),
      );
    }
    newState = updateEntity(
      newState,
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
    newState = {
      ...newState,
      messageLog: [...newState.messageLog, `Equipped to slot ${slot}.`],
    };
  } else {
    newState = {
      ...newState,
      messageLog: [...newState.messageLog, "Discarded."],
    };
  }
  return newState;
}
