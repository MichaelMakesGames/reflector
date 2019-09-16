import { isActionOf } from "typesafe-actions";
import * as actions from "../actions";
import { getAIActions } from "../../utils/ai";
import { addEntity } from "../handlers/addEntity";
import { attack } from "../handlers/attack";
import { move } from "../handlers/move";
import * as selectors from "../selectors";
import { GameState } from "../../types";
import { updateEntity } from "../handlers/updateEntity";

export default function processAI(state: GameState): GameState {
  let newState = state;
  for (const entity of selectors.entitiesWithComps(newState, "ai")) {
    const aiActions = getAIActions(entity, newState);
    for (const action of aiActions) {
      if (isActionOf(actions.move, action)) {
        newState = move(newState, action);
      } else if (isActionOf(actions.attack, action)) {
        newState = attack(newState, action);
      } else if (isActionOf(actions.updateEntity, action)) {
        newState = updateEntity(newState, action);
      } else if (isActionOf(actions.addEntity)) {
        newState = addEntity(newState, action);
      } else {
        console.warn("Unhandled AI action", action);
      }
    }
  }
  return newState;
}
