import * as actions from "../actions";
import { updateEntity } from "../handlers/updateEntity";
import * as selectors from "../selectors";
import { GameState } from "../types";
import { isPosEqual } from "../utils";

export default function processTeleporters(state: GameState): GameState {
  const [teleporter1, teleporter2] = selectors
    .entityList(state)
    .filter(e => e.teleporter);
  const player = selectors.player(state);
  if (
    player &&
    player.position &&
    teleporter1 &&
    teleporter1.position &&
    teleporter2 &&
    teleporter2.position
  ) {
    if (
      isPosEqual(player.position, teleporter1.position) &&
      selectors
        .entitiesAtPosition(state, teleporter2.position)
        .every(e => !e.blocking)
    ) {
      state = updateEntity(
        state,
        actions.updateEntity({
          id: player.id,
          position: { ...teleporter2.position },
        }),
      );
    } else if (
      isPosEqual(player.position, teleporter2.position) &&
      selectors
        .entitiesAtPosition(state, teleporter1.position)
        .every(e => !e.blocking)
    ) {
      state = updateEntity(
        state,
        actions.updateEntity({
          id: player.id,
          position: { ...teleporter1.position },
        }),
      );
    }
  }
  return state;
}
