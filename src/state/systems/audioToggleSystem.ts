import WrappedState from "~types/WrappedState";
import { areConditionsMet } from "~lib/conditions";
import audio from "~lib/audio";

export default function audioToggleSystem(state: WrappedState): void {
  for (const entity of state.select.entitiesWithComps("audioToggle", "pos")) {
    const conditionsMet = areConditionsMet(
      state,
      entity,
      ...entity.audioToggle.conditions,
    );
    if (conditionsMet) {
      audio.loopAtPos(
        entity.audioToggle.soundName,
        entity.pos,
        entity.audioToggle.soundOptions,
      );
    } else {
      audio.stopAtPos(entity.audioToggle.soundName, entity.pos);
    }
  }
}
