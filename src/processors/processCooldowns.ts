import * as actions from "../actions";
import { addEntity } from "../handlers/addEntity";
import * as selectors from "../selectors";
import { GameState } from "../types";

export default function processCooldowns(state: GameState): GameState {
  for (const entity of selectors.entityList(state).filter(e => e.cooldown)) {
    if (entity.cooldown) {
      state = addEntity(
        state,
        actions.addEntity({
          entity: {
            ...entity,
            cooldown: {
              time: entity.cooldown.time && entity.cooldown.time - 1,
            },
          },
        }),
      );
    }
  }
  for (const entity of selectors.weapons(state)) {
    if (entity.weapon) {
      state = addEntity(
        state,
        actions.addEntity({
          entity: {
            ...entity,
            weapon: {
              ...entity.weapon,
              readyIn:
                entity.weapon.readyIn > 0 ? entity.weapon.readyIn - 1 : 0,
            },
          },
        }),
      );
    }
  }
  return state;
}
