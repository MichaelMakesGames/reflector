import { getAIActions } from "~/utils/ai";
import WrappedState from "~types/WrappedState";

export default function processAI(state: WrappedState): void {
  for (const entity of state.select.entitiesWithComps("ai")) {
    console.warn("processing AI entity", entity);
    const aiActions = getAIActions(entity, state);
    console.warn(aiActions);
    for (const action of aiActions) {
      state.handle(action);
    }
  }
}
