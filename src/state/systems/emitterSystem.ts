import WrappedState from "../../types/WrappedState";
import { areConditionsMet } from "../../lib/conditions";

export default function emitterSystem(state: WrappedState): void {
  state.select.entitiesWithComps("smokeEmitter", "pos").forEach((entity) => {
    entity.smokeEmitter.emitters.forEach((emitter) => {
      if (areConditionsMet(state, entity, ...emitter.conditions)) {
        state.renderer.addSmoke(entity.pos, emitter.offset);
      } else {
        state.renderer.stopSmoke(entity.pos, emitter.offset);
      }
    });
  });
}
