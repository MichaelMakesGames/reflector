/* eslint-disable import/prefer-default-export */
import { RawState, Pos } from "~/types";
import { rangeFromTo } from "./math";
import { arePositionsEqual } from "./geometry";
import { MAP_WIDTH, MAP_HEIGHT } from "~constants";
import WrappedState from "~types/WrappedState";

export function findValidPositions(
  state: WrappedState,
  buildFroms: {
    pos: Pos;
    range: number;
  }[],
  canPlace: (state: RawState, pos: Pos) => boolean,
  edgesAllowed: boolean,
): Pos[] {
  const results: Pos[] = [];
  for (const buildFrom of buildFroms) {
    for (const dx of rangeFromTo(-buildFrom.range, buildFrom.range + 1)) {
      for (const dy of rangeFromTo(-buildFrom.range, buildFrom.range + 1)) {
        const pos = { x: buildFrom.pos.x + dx, y: buildFrom.pos.y + dy };
        const isEdge =
          pos.x === 0 ||
          pos.y === 0 ||
          pos.x === MAP_WIDTH - 1 ||
          pos.y === MAP_HEIGHT - 1;
        if (
          !state.select.isPositionBlocked(pos) &&
          !results.some((other) => arePositionsEqual(pos, other)) &&
          canPlace(state.raw, pos) &&
          (edgesAllowed || !isEdge)
        ) {
          results.push(pos);
        }
      }
    }
  }
  return results;
}
