import { getAIActions } from "~/utils/ai";
import WrappedState from "~types/WrappedState";

export default function processAI(state: WrappedState): void {
  for (const entity of state.select.entitiesWithComps("ai")) {
    const aiActions = getAIActions(entity, state);
    for (const action of aiActions) {
      state.handle(action);
    }
  }
}
