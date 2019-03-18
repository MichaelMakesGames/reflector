import makeLevel from "../makeLevel";
import * as selectors from "../selectors";
import { GameState } from "../types";
import { isPosEqual } from "../utils";

export default function processStairs(state: GameState): GameState {
  const player = selectors.player(state);
  const stairs = selectors.entityList(state).filter(e => e.stairs)[0];
  if (!player || !stairs || !player.position || !stairs.position) return state;
  if (isPosEqual(player.position, stairs.position)) {
    state = makeLevel(state);
  }
  return state;
}
