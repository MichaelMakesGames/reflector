import { getAIActions } from "~/utils/ai";
import selectors from "~/state/selectors";
import { GameState } from "~/types";
import handleAction from "~state/handleAction";

export default function processAI(state: GameState): GameState {
  let newState = state;
  for (const entity of selectors.entitiesWithComps(newState, "ai")) {
    const aiActions = getAIActions(entity, newState);
    for (const action of aiActions) {
      newState = handleAction(newState, action);
    }
  }
  return newState;
}
