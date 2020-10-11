import WrappedState from "~types/WrappedState";
import { areConditionsMet } from "~utils/conditions";

export default function processColorToggle(state: WrappedState): void {
  for (const entity of state.select.entitiesWithComps(
    "colorToggle",
    "display",
  )) {
    const conditionsMet = areConditionsMet(
      state,
      entity,
      ...entity.colorToggle.conditions,
    );
    const newColor = conditionsMet
      ? entity.colorToggle.trueColor
      : entity.colorToggle.falseColor;
    if (newColor !== entity.display.color) {
      state.act.updateEntity({
        id: entity.id,
        display: {
          ...entity.display,
          color: newColor,
        },
      });
    }
  }
}
