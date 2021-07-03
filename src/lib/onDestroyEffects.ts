import actions from "~state/actions";
import { Action, Entity } from "~types";
import WrappedState from "~types/WrappedState";
import { createEntityFromTemplate } from "./entities";

const onDestroyEffects: {
  [id: string]: (state: WrappedState, entity: Entity) => Action[];
} = {
  colonist(state: WrappedState, entity: Entity) {
    const results: Action[] = [
      actions.reduceMorale({ amount: 1 }),
      actions.logEvent({ type: "COLONIST_DIED" }),
    ];
    if (entity.colonist && entity.colonist.residence) {
      const residence = state.select.entityById(entity.colonist.residence);
      if (residence && residence.housing) {
        results.push(
          actions.updateEntity({
            id: residence.id,
            housing: {
              ...residence.housing,
              occupancy: residence.housing.occupancy - 1,
            },
          }),
        );
      }
    }
    if (entity.colonist && entity.colonist.employment) {
      const employment = state.select.entityById(entity.colonist.employment);
      if (employment && employment.jobProvider) {
        results.push(
          actions.updateEntity({
            id: employment.id,
            jobProvider: {
              ...employment.jobProvider,
              numberEmployed: employment.jobProvider.numberEmployed - 1,
            },
          }),
        );
      }
    }
    return results;
  },

  wall(state: WrappedState, entity: Entity) {
    return [
      actions.addEntity(
        createEntityFromTemplate("BUILDING_WALL_DAMAGED", { pos: entity.pos }),
      ),
    ];
  },

  player(state: WrappedState, entity: Entity) {
    return [
      actions.addEntity(
        createEntityFromTemplate("PLAYER_CORPSE", {
          pos: entity.pos,
        }),
      ),
    ];
  },

  enemyArmored(state: WrappedState, entity: Entity) {
    const drone = createEntityFromTemplate("ENEMY_DRONE", {
      pos: entity.pos,
    });
    if (drone.ai && entity.ai) {
      drone.ai = {
        ...drone.ai,
        plannedAction: entity.ai.plannedAction,
        plannedActionDirection: entity.ai.plannedActionDirection,
      };
    }
    return [actions.addEntity(drone)];
  },
};

export default onDestroyEffects;
