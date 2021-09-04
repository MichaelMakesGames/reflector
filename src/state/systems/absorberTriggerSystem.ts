import { DOWN, LEFT, RIGHT, UP } from "../../constants";
import { getPositionToDirection } from "../../lib/geometry";
import WrappedState from "../../types/WrappedState";

export default function absorberTriggerSystem(state: WrappedState): void {
  for (const entity of state.select
    .entitiesWithComps("absorber", "pos")
    .filter((e) => e.absorber.charged)) {
    for (const direction of [UP, RIGHT, DOWN, LEFT]) {
      const pos = getPositionToDirection(entity.pos, direction);
      const entitiesAtPos = state.select.entitiesAtPosition(pos);
      if (entitiesAtPos.some((e) => e.ai && e.blocking?.lasers)) {
        state.act.targetWeapon({ direction, source: entity.id });
        state.act.updateEntity({
          id: entity.id,
          absorber: {
            ...entity.absorber,
            aimingDirection: direction,
          },
        });
      }
    }
  }
}
