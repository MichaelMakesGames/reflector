import { GameState } from "../../types";
import { arePositionsEqual } from "../../utils/geometry";
import * as actions from "../actions";
import { updateEntity } from "../handlers/updateEntity";
import * as selectors from "../selectors";

export default function processTeleporters(state: GameState): GameState {
  let newState = state;
  const [teleporter1, teleporter2] = selectors.entitiesWithComps(
    newState,
    "teleporter",
    "pos",
  );
  const player = selectors.player(newState);
  if (player && teleporter1 && teleporter2) {
    if (
      arePositionsEqual(player.pos, teleporter1.pos) &&
      selectors
        .entitiesAtPosition(newState, teleporter2.pos)
        .every(e => !e.blocking)
    ) {
      newState = updateEntity(
        newState,
        actions.updateEntity({
          id: player.id,
          pos: { ...teleporter2.pos },
        }),
      );
    } else if (
      arePositionsEqual(player.pos, teleporter2.pos) &&
      selectors
        .entitiesAtPosition(newState, teleporter1.pos)
        .every(e => !e.blocking)
    ) {
      newState = updateEntity(
        newState,
        actions.updateEntity({
          id: player.id,
          pos: { ...teleporter1.pos },
        }),
      );
    }
  }
  return newState;
}
