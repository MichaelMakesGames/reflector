import WrappedState from "../../types/WrappedState";
import { areConditionsMet } from "../../lib/conditions";
import { getDistance } from "../../lib/geometry";
import colors from "../../colors";

export default function reflectorSystem(state: WrappedState): void {
  const reflectors = state.select.entitiesWithComps(
    "reflector",
    "pos",
    "display"
  );
  const projectors = state.select.entitiesWithComps("projector", "pos");
  for (const reflector of reflectors) {
    if (state.select.isPositionBlocked(reflector.pos)) {
      state.act.removeEntity(reflector.id);
    }

    const outOfRange = projectors
      .filter((projector) =>
        areConditionsMet(state, projector, projector.projector.condition)
      )
      .every(
        (projector) =>
          getDistance(projector.pos, reflector.pos) > projector.projector.range
      );
    if (outOfRange) {
      if (reflector.reflector.outOfRange) {
        state.act.removeEntity(reflector.id);
      } else {
        state.act.updateEntity({
          id: reflector.id,
          reflector: {
            ...reflector.reflector,
            outOfRange: true,
          },
          display: {
            ...reflector.display,
            tile: ["blank", "blank", "reflector", "reflector"],
            color: colors.player,
          },
        });
      }
    } else if (reflector.reflector.outOfRange) {
      state.act.updateEntity({
        id: reflector.id,
        reflector: {
          ...reflector.reflector,
          outOfRange: false,
        },
        display: {
          ...reflector.display,
          tile: "reflector",
          color: colors.player,
        },
      });
    }
  }
}
