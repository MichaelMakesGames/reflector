import WrappedState from "~types/WrappedState";
import { getDistance } from "~utils/geometry";

export default function processReflectors(state: WrappedState): void {
  const reflectors = state.select.entitiesWithComps("reflector", "pos");
  const projectors = state.select.entitiesWithComps("projector", "pos");
  for (const reflector of reflectors) {
    if (state.select.isPositionBlocked(reflector.pos)) {
      state.act.removeEntity(reflector.id);
    }

    if (
      projectors.every(
        projector =>
          getDistance(projector.pos, reflector.pos) > projector.projector.range,
      )
    ) {
      state.act.removeEntity(reflector.id);
    }
  }
}
