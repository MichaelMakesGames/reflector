import { createStandardAction } from "typesafe-actions";
import { registerHandler } from "~state/handleAction";
import WrappedState from "~types/WrappedState";
import onDestroyEffects from "~lib/onDestroyEffects";

const destroy = createStandardAction("DESTROY")<string>();
export default destroy;

function destroyHandler(
  state: WrappedState,
  action: ReturnType<typeof destroy>,
): void {
  const entityId = action.payload;
  const entity = state.select.entityById(entityId);
  if (entity.destructible) {
    if (entity.destructible.onDestroy) {
      const effect = onDestroyEffects[entity.destructible.onDestroy];
      if (effect) {
        const effectActions = effect(state, entity);
        effectActions.forEach((effectAction) => state.handle(effectAction));
      }
    }
    state.act.removeEntity(entityId);
  }
}

registerHandler(destroyHandler, destroy);
