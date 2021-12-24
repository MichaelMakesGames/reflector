import WrappedState from "../../types/WrappedState";
import { areConditionsMet } from "../../lib/conditions";

export default function audioToggleSystem(state: WrappedState): void {
  for (const entity of state.select.entitiesWithComps("audioToggle", "pos")) {
    const conditionsMet = areConditionsMet(
      state,
      entity,
      ...entity.audioToggle.conditions
    );
    if (conditionsMet) {
      state.audio.loopAtPos(
        entity.audioToggle.soundName,
        entity.pos,
        entity.audioToggle.soundOptions
      );
    } else {
      state.audio.stopAtPos(entity.audioToggle.soundName, entity.pos);
    }
  }
}
