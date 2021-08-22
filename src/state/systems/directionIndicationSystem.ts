import WrappedState from "../../types/WrappedState";
import { getConstDir } from "../../lib/geometry";
import { UP, DOWN, LEFT, RIGHT } from "../../constants";
import { createEntityFromTemplate } from "../../lib/entities";

export default function directionIndicationSystem(state: WrappedState): void {
  state.act.removeEntities(
    state.select.entitiesWithComps("directionIndicator").map((e) => e.id)
  );
  state.select.entitiesWithComps("pos", "ai").forEach((entity) => {
    const { pos } = entity;
    const direction = entity.ai.plannedActionDirection;
    if (direction) {
      if (getConstDir(direction) === UP)
        state.act.addEntity(
          createEntityFromTemplate("UI_DIRECTION_N", { pos })
        );
      if (getConstDir(direction) === DOWN)
        state.act.addEntity(
          createEntityFromTemplate("UI_DIRECTION_S", { pos })
        );
      if (getConstDir(direction) === LEFT)
        state.act.addEntity(
          createEntityFromTemplate("UI_DIRECTION_W", { pos })
        );
      if (getConstDir(direction) === RIGHT)
        state.act.addEntity(
          createEntityFromTemplate("UI_DIRECTION_E", { pos })
        );
    }
  });
}
