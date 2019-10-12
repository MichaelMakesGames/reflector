/* eslint-disable import/prefer-default-export */
import { GameState, Pos } from "~/types";
import * as selectors from "~/state/selectors";
import { rangeFromTo } from "./math";
import { arePositionsEqual } from "./geometry";

export function findValidPositions(
  gameState: GameState,
  buildFroms: {
    pos: Pos;
    range: number;
  }[],
): Pos[] {
  const results: Pos[] = [];
  for (const buildFrom of buildFroms) {
    for (const dx of rangeFromTo(-buildFrom.range, buildFrom.range + 1)) {
      for (const dy of rangeFromTo(-buildFrom.range, buildFrom.range + 1)) {
        const pos = { x: buildFrom.pos.x + dx, y: buildFrom.pos.y + dy };
        if (
          !selectors.isPositionBlocked(gameState, pos) &&
          !results.some(other => arePositionsEqual(pos, other))
        ) {
          results.push(pos);
        }
      }
    }
  }
  return results;
}
