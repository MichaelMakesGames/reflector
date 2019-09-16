import * as actions from "../actions";
import { attack } from "../handlers/attack";
import { removeEntity } from "../handlers/removeEntity";
import { updateEntity } from "../handlers/updateEntity";
import * as selectors from "../selectors";
import { GameState } from "../../types";
import { getAdjacentPositions } from "../../utils/geometry";

export default function processBombs(state: GameState): GameState {
  let newState = state;
  for (const entity of selectors.entitiesWithComps(newState, "pos", "bomb")) {
    if (entity.bomb.time <= 0) {
      newState = removeEntity(
        newState,
        actions.removeEntity({ entityId: entity.id }),
      );
      for (const pos of getAdjacentPositions(entity.pos)) {
        for (const e of selectors.entitiesAtPosition(newState, pos)) {
          if (e.hitPoints || e.destructible) {
            newState = attack(
              newState,
              actions.attack({
                target: e.id,
                message: "You are caught in the bomb's explosion!",
              }),
            );
          }
        }
      }
    } else {
      newState = updateEntity(
        newState,
        actions.updateEntity({
          id: entity.id,
          bomb: { time: entity.bomb.time - 1 },
        }),
      );
    }
  }
  return newState;
}
