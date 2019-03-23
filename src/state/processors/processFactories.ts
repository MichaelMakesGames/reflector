import * as actions from "../actions";
import { addEntity } from "../handlers/addEntity";
import { updateEntity } from "../handlers/updateEntity";
import * as selectors from "../selectors";
import { createEntityFromTemplate } from "../../utils";
import { GameState } from "../../types";
import { getAdjacentPositions } from "../../utils";

export default function processFactories(state: GameState): GameState {
  for (let entity of selectors
    .entitiesWithComps(state, "factory", "cooldown", "pos")
    .filter(e => !e.cooldown.time)) {
    const emptyAdjacentPositions = getAdjacentPositions(entity.pos).filter(
      pos => selectors.entitiesAtPosition(state, pos).every(e => !e.blocking),
    );
    if (!emptyAdjacentPositions.length) continue;
    const choice =
      emptyAdjacentPositions[
        Math.floor(Math.random() * emptyAdjacentPositions.length)
      ];
    state = addEntity(
      state,
      actions.addEntity({
        entity: createEntityFromTemplate(entity.factory.type, {
          pos: choice,
        }),
      }),
    );
    state = updateEntity(
      state,
      actions.updateEntity({
        id: entity.id,
        cooldown: { time: entity.factory.cooldown + 1 },
      }),
    );
  }
  return state;
}
