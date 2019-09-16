import { GameState } from "../../types";
import { arePositionsEqual } from "../../utils/geometry";
import makeLevel from "../../utils/makeLevel";
import * as selectors from "../selectors";

export default function processStairs(state: GameState): GameState {
  let newState = state;
  const player = selectors.player(newState);
  const stairs = selectors.entitiesWithComps(newState, "stairs", "pos")[0];
  if (!player || !stairs) return newState;
  if (arePositionsEqual(player.pos, stairs.pos)) {
    newState = makeLevel(newState);
  }
  return newState;
}
