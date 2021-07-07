import { RNG } from "rot-js";
import { createStandardAction } from "typesafe-actions";
import templates from "~data/templates";
import audio from "~lib/audio";
import { createEntityFromTemplate } from "~lib/entities";
import { getAdjacentPositions } from "~lib/geometry";
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
  if (!entity) return;

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
      if (entity.building) {
        const rubble = createEntityFromTemplate("BUILDING_RUBBLE", {
          pos: entity.pos,
        });
        const blueprint = entity.template.replace(
          "BUILDING",
          "BLUEPRINT",
        ) as TemplateName;
        if (Object.keys(templates).includes(blueprint)) {
          rubble.rebuildable = { blueprint };
          rubble.description = {
            name: entity.description
              ? `${entity.description.name} Rubble`
              : "Rubble",
            description: "",
          };
          state.act.addEntity(rubble);
        } else {
          console.error(`Failed to find rubble blueprint: ${blueprint}`);
        }

        renderer.dustCloud(entity.pos);
        audio.playAtPos("building_destroyed", entity.pos);
      } else if (entity.ai) {
        audio.playAtPos(
          RNG.getItem(["alien_death_1", "alien_death_2", "alien_death_3"]) ||
            "",
          entity.pos,
        );
      }

      if (entity.destructible.explosive) {
        renderer.explode(entity.pos);
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
          { rollOff: 0.1, volume: 2 },
        );
        for (const adjacentPos of [
          entity.pos,
          ...getAdjacentPositions(entity.pos),
        ]) {
          for (const adjacentEntity of state.select.entitiesAtPosition(
            adjacentPos,
          )) {
            if (adjacentEntity.destructible)
              state.act.destroy(adjacentEntity.id);
          }
        }
      }
    }
  }
}

registerHandler(destroyHandler, destroy);
