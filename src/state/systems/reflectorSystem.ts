import WrappedState from "~types/WrappedState";
import { areConditionsMet } from "~lib/conditions";
import { getDistance } from "~lib/geometry";

export default function reflectorSystem(state: WrappedState): void {
  const reflectors = state.select.entitiesWithComps("reflector", "pos");
  const projectors = state.select.entitiesWithComps("projector", "pos");
  for (const reflector of reflectors) {
    if (state.select.isPositionBlocked(reflector.pos)) {
      state.act.removeEntity(reflector.id);
    }

    if (
      projectors
        .filter((projector) =>
          areConditionsMet(state, projector, projector.projector.condition),
        )
        .every(
          (projector) =>
            getDistance(projector.pos, reflector.pos) >
            projector.projector.range,
        )
    ) {
      state.act.removeEntity(reflector.id);
    }
  }
}
