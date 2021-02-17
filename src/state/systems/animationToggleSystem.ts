import WrappedState from "~types/WrappedState";
import { areConditionsMet } from "~lib/conditions";
import renderer from "~renderer";

export default function animationToggleSystem(state: WrappedState): void {
  state.select.entitiesWithComps("animationToggle").forEach((entity) => {
    if (areConditionsMet(state, entity, ...entity.animationToggle.conditions)) {
      renderer.playAnimation(entity.id);
    } else {
      renderer.stopAnimation(entity.id);
    }
  });
}
