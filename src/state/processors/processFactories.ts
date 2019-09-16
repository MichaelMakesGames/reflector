import * as actions from "../actions";
import { addEntity } from "../handlers/addEntity";
import { updateEntity } from "../handlers/updateEntity";
import * as selectors from "../selectors";
import { createEntityFromTemplate } from "../../utils/entities";
import { getAdjacentPositions } from "../../utils/geometry";
import { GameState } from "../../types";

export default function processFactories(state: GameState): GameState {
  let newState = state;
  for (const entity of selectors
    .entitiesWithComps(newState, "factory", "cooldown", "pos")
    .filter(e => !e.cooldown.time)) {
    const emptyAdjacentPositions = getAdjacentPositions(entity.pos).filter(
      pos =>
        selectors.entitiesAtPosition(newState, pos).every(e => !e.blocking),
    );
    if (emptyAdjacentPositions.length) {
      const choice =
        emptyAdjacentPositions[
          Math.floor(Math.random() * emptyAdjacentPositions.length)
        ];
      newState = addEntity(
        newState,
        actions.addEntity({
          entity: createEntityFromTemplate(entity.factory.type, {
            pos: choice,
          }),
        }),
      );
      newState = updateEntity(
        newState,
        actions.updateEntity({
          id: entity.id,
          cooldown: { time: entity.factory.cooldown + 1 },
        }),
      );
    }
  }
  return newState;
}
