import WrappedState from "~types/WrappedState";
import { areConditionsMet } from "~utils/conditions";
import { addSmoke, stopSmoke } from "~renderer";

export default function processEmitters(state: WrappedState): void {
  state.select.entitiesWithComps("smokeEmitter", "pos").forEach((entity) => {
    entity.smokeEmitter.emitters.forEach((emitter) => {
      if (areConditionsMet(state, entity, ...emitter.conditions)) {
        addSmoke(entity.pos, emitter.offset);
      } else {
        stopSmoke(entity.pos, emitter.offset);
      }
    });
  });
}
