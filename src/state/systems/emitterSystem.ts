import WrappedState from "../../types/WrappedState";
import { areConditionsMet } from "../../lib/conditions";
import renderer from "../../renderer";

export default function emitterSystem(state: WrappedState): void {
  state.select.entitiesWithComps("smokeEmitter", "pos").forEach((entity) => {
    entity.smokeEmitter.emitters.forEach((emitter) => {
      if (areConditionsMet(state, entity, ...emitter.conditions)) {
        renderer.addSmoke(entity.pos, emitter.offset);
      } else {
        renderer.stopSmoke(entity.pos, emitter.offset);
      }
    });
  });
}
