import { RNG } from "rot-js";
import { createStandardAction } from "typesafe-actions";
import audio from "~lib/audio";
import onDestroyEffects from "~lib/onDestroyEffects";
import renderer from "~renderer";
import { registerHandler } from "~state/handleAction";
import WrappedState from "~types/WrappedState";

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

    if (entity.pos) {
      renderer.explode(entity.pos);
      if (entity.building) {
        audio.playAtPos(
          RNG.getItem([
            "building_destroyed_1",
            "building_destroyed_2",
            "building_destroyed_3",
          ]) || "",
          entity.pos,
        );
      } else {
        audio.playAtPos(
          RNG.getItem([
            "explosion_1",
            "explosion_2",
            "explosion_3",
            "explosion_4",
            "explosion_5",
            "explosion_6",
            "explosion_7",
          ]) || "",
          entity.pos,
          { rollOff: 0.1, volume: 3 },
        );
      }
    }
  }
}

registerHandler(destroyHandler, destroy);
