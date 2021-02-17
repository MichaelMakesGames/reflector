import { getAIActions } from "~lib/ai";
import WrappedState from "~types/WrappedState";

export default function aiSystem(state: WrappedState): void {
  for (const entity of state.select.entitiesWithComps("ai")) {
    const aiActions = getAIActions(entity, state);
    for (const action of aiActions) {
      state.handle(action);
    }
  }
}
