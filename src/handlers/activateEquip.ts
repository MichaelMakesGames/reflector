import * as actions from "../actions";
import * as selectors from "../selectors";
import { GameState } from "../types";
import { executeEquip } from "./executeEquip";
import { updateEntity } from "./updateEntity";

export function activateEquip(
  state: GameState,
  action: ReturnType<typeof actions.activateEquip>,
) {
  state = updateEntity(
    state,
    actions.updateEntity({
      id: action.payload.entity.id,
      equipping: {},
    }),
  );

  if (!selectors.weaponInSlot(state, 1)) {
    state = executeEquip(state, actions.executeEquip({ slot: 1 }));
  } else if (!selectors.weaponInSlot(state, 2)) {
    state = executeEquip(state, actions.executeEquip({ slot: 2 }));
  } else if (!selectors.weaponInSlot(state, 3)) {
    state = executeEquip(state, actions.executeEquip({ slot: 3 }));
  } else if (!selectors.weaponInSlot(state, 4)) {
    state = executeEquip(state, actions.executeEquip({ slot: 4 }));
  } else {
    state = {
      ...state,
      messageLog: [
        ...state.messageLog,
        "Equipping weapon... Please select slot.",
      ],
    };
  }

  return state;
}
