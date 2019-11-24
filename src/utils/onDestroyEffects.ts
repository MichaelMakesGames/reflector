import { Action, Entity } from "~types";
import actions from "~state/actions";
import { createEntityFromTemplate } from "./entities";

const onDestroyEffects: { [id: string]: (entity: Entity) => Action | null } = {
  house(entity: Entity) {
    if (entity.housing) {
      return actions.reduceMorale({ amount: entity.housing.occupancy });
    }
    return null;
  },

  wall(entity: Entity) {
    return actions.addEntity({
      entity: createEntityFromTemplate("WALL_DAMAGED", { pos: entity.pos }),
    });
  },

  player(entity: Entity) {
    return actions.addEntity({
      entity: createEntityFromTemplate("PLAYER_CORPSE", {
        pos: entity.pos,
      }),
    });
  },
};

export default onDestroyEffects;
