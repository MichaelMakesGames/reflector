import { GameState } from "../../types";
import { arePositionsEqual, makeLevel } from "../../utils";
import * as selectors from "../selectors";

export default function processStairs(state: GameState): GameState {
  const player = selectors.player(state);
  const stairs = selectors.entitiesWithComps(state, "stairs", "pos")[0];
  if (!player || !stairs) return state;
  if (arePositionsEqual(player.pos, stairs.pos)) {
    state = makeLevel(state);
  }
  return state;
}
