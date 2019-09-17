import * as actions from "~/state/actions";
import { updateEntity } from "~/state/handlers/updateEntity";
import * as selectors from "~/state/selectors";
import { GameState } from "~/types";

export default function processCooldowns(state: GameState): GameState {
  let newState = state;
  for (const entity of selectors.entityList(newState).filter(e => e.cooldown)) {
    if (entity.cooldown) {
      newState = updateEntity(
        newState,
        actions.updateEntity({
          id: entity.id,
          cooldown: {
            time: entity.cooldown.time && entity.cooldown.time - 1,
          },
        }),
      );
    }
  }
  for (const entity of selectors.weapons(newState)) {
    if (entity.weapon) {
      newState = updateEntity(
        newState,
        actions.updateEntity({
          id: entity.id,
          weapon: {
            ...entity.weapon,
            readyIn: entity.weapon.readyIn > 0 ? entity.weapon.readyIn - 1 : 0,
          },
        }),
      );
    }
  }
  return newState;
}
