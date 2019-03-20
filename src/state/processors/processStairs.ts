import { GameState } from "../../types";
import { arePositionsEqual, makeLevel } from "../../utils";
import * as selectors from "../selectors";

export default function processStairs(state: GameState): GameState {
  const player = selectors.player(state);
  const stairs = selectors.entityList(state).filter(e => e.stairs)[0];
  if (!player || !stairs || !player.position || !stairs.position) return state;
  if (arePositionsEqual(player.position, stairs.position)) {
    state = makeLevel(state);
  }
  return state;
}
