import { Action, Entity } from "~types";
import actions from "~state/actions";
import { createEntityFromTemplate } from "./entities";

const onDestroyEffects: { [id: string]: (entity: Entity) => Action | null } = {
  colonist(entity: Entity) {
    return actions.reduceMorale({ amount: 1 });
  },

  wall(entity: Entity) {
    return actions.addEntity(
      createEntityFromTemplate("WALL_DAMAGED", { pos: entity.pos }),
    );
  },

  player(entity: Entity) {
    return actions.addEntity(
      createEntityFromTemplate("PLAYER_CORPSE", {
        pos: entity.pos,
      }),
    );
  },
};

export default onDestroyEffects;
