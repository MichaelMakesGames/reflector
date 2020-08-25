import WrappedState from "~types/WrappedState";
import { areConditionsMet } from "~utils/conditions";
import { playAnimation, stopAnimation } from "~renderer";

export default function processAnimationToggle(state: WrappedState): void {
  state.select.entitiesWithComps("animationToggle").forEach((entity) => {
    if (areConditionsMet(state, entity, ...entity.animationToggle.conditions)) {
      playAnimation(entity.id);
    } else {
      stopAnimation(entity.id);
    }
  });
}
