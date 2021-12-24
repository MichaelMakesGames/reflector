import WrappedState from "../../types/WrappedState";
import { areConditionsMet } from "../../lib/conditions";

export default function animationToggleSystem(state: WrappedState): void {
  state.select.entitiesWithComps("animationToggle").forEach((entity) => {
    if (areConditionsMet(state, entity, ...entity.animationToggle.conditions)) {
      state.renderer.playAnimation(entity.id);
    } else {
      state.renderer.stopAnimation(entity.id);
    }
  });
}
