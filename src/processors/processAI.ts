import { isActionOf } from "typesafe-actions";
import * as actions from "../actions";
import { getAIActions } from "../ai";
import { addEntity } from "../handlers/addEntity";
import { attack } from "../handlers/attack";
import { move } from "../handlers/move";
import * as selectors from "../selectors";
import { GameState } from "../types";

export default function processAI(state: GameState): GameState {
  const entities = selectors.entityList(state);
  for (let entity of entities.filter(entity => entity.ai)) {
    const aiActions = getAIActions(entity, state);
    for (let action of aiActions) {
      if (isActionOf(actions.move, action)) {
        state = move(state, action);
      } else if (isActionOf(actions.attack, action)) {
        state = attack(state, action);
      } else if (isActionOf(actions.addEntity)) {
        state = addEntity(state, action);
      } else {
        console.warn("Unhandled AI action", action);
      }
    }
  }
  return state;
}
