import { isActionOf } from "typesafe-actions";
import * as actions from "../actions";
import { getAIActions } from "../../utils";
import { addEntity } from "../handlers/addEntity";
import { attack } from "../handlers/attack";
import { move } from "../handlers/move";
import * as selectors from "../selectors";
import { GameState } from "../../types";
import { updateEntity } from "../handlers/updateEntity";

export default function processAI(state: GameState): GameState {
  for (let entity of selectors.entitiesWithComps(state, "ai")) {
    const aiActions = getAIActions(entity, state);
    for (let action of aiActions) {
      if (isActionOf(actions.move, action)) {
        state = move(state, action);
      } else if (isActionOf(actions.attack, action)) {
        state = attack(state, action);
      } else if (isActionOf(actions.updateEntity, action)) {
        state = updateEntity(state, action);
      } else if (isActionOf(actions.addEntity)) {
        state = addEntity(state, action);
      } else {
        console.warn("Unhandled AI action", action);
      }
    }
  }
  return state;
}
