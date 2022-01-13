import { RNG } from "rot-js";
import { createAction } from "typesafe-actions";
import colors from "../../colors";
import { executeEffect } from "../../data/effects";
import templates from "../../data/templates";
import { createEntityFromTemplate } from "../../lib/entities";
import { getAdjacentPositions } from "../../lib/geometry";
import { TemplateName } from "../../types/TemplateName";
import WrappedState from "../../types/WrappedState";
import { registerHandler } from "../handleAction";

const destroy = createAction("DESTROY")<string>();
export default destroy;

function destroyHandler(
  state: WrappedState,
  action: ReturnType<typeof destroy>
): void {
  const entityId = action.payload;
  const entity = state.select.entityById(entityId);
  if (!entity) return;

  if (entity.destructible) {
    state.act.removeEntity(entityId);

    executeEffect(entity.destructible.onDestroy, state, undefined, entity);

    if (entity.windowed) {
      executeEffect("CLEAR_UI_WINDOW", state, undefined, entity);
    }

    if (entity.pos) {
      if (entity.building) {
        const blueprint =
          entity.building.rubbleBlueprint ||
          (Object.entries(templates).find(
            ([templateName, template]) =>
              template?.blueprint?.builds === entity.template
          )?.[0] as TemplateName | undefined);
        if (!entity.building.noRubble && blueprint) {
          const rubble = createEntityFromTemplate("BUILDING_RUBBLE", {
            pos: entity.pos,
          });
          rubble.rebuildable = { blueprint };
          const blueprintEntity = createEntityFromTemplate(blueprint);
          const rebuiltEntity = blueprintEntity?.blueprint
            ? createEntityFromTemplate(blueprintEntity.blueprint.builds)
            : undefined;
          rubble.description = {
            name: rebuiltEntity?.description
              ? `${rebuiltEntity.description.name} Rubble`
              : "Rubble",
            description: "",
          };
          state.act.addEntity(rubble);
        }

        state.renderer.dustCloud(entity.pos);
        state.audio.playAtPos("building_destroyed", entity.pos);
      } else if (entity.ai) {
        state.audio.playAtPos(
          RNG.getItem(["alien_death_1", "alien_death_2", "alien_death_3"]) ||
            "",
          entity.pos
        );
        if (!entity.stopsLaser) {
          state.renderer.splatter(
            entity.pos,
            entity.display?.color ?? colors.enemyUnit
          );
        }
      }

      if (entity.destructible.explosive) {
        state.renderer.explode(entity.pos);
        state.audio.playAtPos(
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
          { rollOff: 0.1, volume: 1.5 }
        );
        for (const adjacentPos of [
          entity.pos,
          ...getAdjacentPositions(entity.pos),
        ]) {
          state.act.destroyPos({ target: adjacentPos, from: entity.pos });
        }
      }
    }
  }
}

registerHandler(destroyHandler, destroy);
