import { Action, Entity } from "~types";
import { reduceMorale, addEntity } from "~state/actions";
import { createEntityFromTemplate } from "./entities";

const onDestroyEffects: { [id: string]: (entity: Entity) => Action | null } = {
  house(entity: Entity) {
    if (entity.housing) {
      return reduceMorale({ amount: entity.housing.occupancy });
    }
    return null;
  },

  wall(entity: Entity) {
    return addEntity({
      entity: createEntityFromTemplate("WALL_DAMAGED", { pos: entity.pos }),
    });
  },

  player(entity: Entity) {
    return addEntity({
      entity: createEntityFromTemplate("PLAYER_CORPSE", {
        pos: entity.pos,
      }),
    });
  },
};

export default onDestroyEffects;
