import * as actions from "../actions";
import { addEntity } from "../handlers/addEntity";
import { updateEntity } from "../handlers/updateEntity";
import * as selectors from "../selectors";
import { createEntityFromTemplate } from "../templates";
import { GameState } from "../types";
import { getAdjacentPositions } from "../utils";

export default function processFactories(state: GameState): GameState {
  for (let entity of selectors
    .entityList(state)
    .filter(e => e.factory && e.cooldown && !e.cooldown.time)) {
    if (!entity.factory || !entity.position) continue;
    const emptyAdjacentPositions = getAdjacentPositions(entity.position).filter(
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
          position: choice,
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
