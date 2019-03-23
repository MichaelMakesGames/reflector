import { GameState } from "../../types";
import { arePositionsEqual } from "../../utils";
import * as actions from "../actions";
import { updateEntity } from "../handlers/updateEntity";
import * as selectors from "../selectors";

export default function processTeleporters(state: GameState): GameState {
  const [teleporter1, teleporter2] = selectors.entitiesWithComps(
    state,
    "teleporter",
    "pos",
  );
  const player = selectors.player(state);
  if (player && teleporter1 && teleporter2) {
    if (
      arePositionsEqual(player.pos, teleporter1.pos) &&
      selectors
        .entitiesAtPosition(state, teleporter2.pos)
        .every(e => !e.blocking)
    ) {
      state = updateEntity(
        state,
        actions.updateEntity({
          id: player.id,
          pos: { ...teleporter2.pos },
        }),
      );
    } else if (
      arePositionsEqual(player.pos, teleporter2.pos) &&
      selectors
        .entitiesAtPosition(state, teleporter1.pos)
        .every(e => !e.blocking)
    ) {
      state = updateEntity(
        state,
        actions.updateEntity({
          id: player.id,
          pos: { ...teleporter1.pos },
        }),
      );
    }
  }
  return state;
}
