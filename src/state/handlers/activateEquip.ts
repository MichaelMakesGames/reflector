import * as actions from "../actions";
import * as selectors from "../selectors";
import { GameState } from "../../types";
import { executeEquip } from "./executeEquip";
import { updateEntity } from "./updateEntity";

export function activateEquip(
  state: GameState,
  action: ReturnType<typeof actions.activateEquip>,
) {
  let newState = state;
  newState = updateEntity(
    newState,
    actions.updateEntity({
      id: action.payload.entity.id,
      equipping: {},
    }),
  );

  if (!selectors.weaponInSlot(newState, 1)) {
    newState = executeEquip(newState, actions.executeEquip({ slot: 1 }));
  } else if (!selectors.weaponInSlot(newState, 2)) {
    newState = executeEquip(newState, actions.executeEquip({ slot: 2 }));
  } else if (!selectors.weaponInSlot(newState, 3)) {
    newState = executeEquip(newState, actions.executeEquip({ slot: 3 }));
  } else if (!selectors.weaponInSlot(newState, 4)) {
    newState = executeEquip(newState, actions.executeEquip({ slot: 4 }));
  } else {
    newState = {
      ...newState,
      messageLog: [
        ...newState.messageLog,
        "Equipping weapon... Please select slot.",
      ],
    };
  }

  return newState;
}
