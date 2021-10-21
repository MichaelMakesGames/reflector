/* eslint-disable import/prefer-default-export */
import { Pos, RawState } from "../types";
import WrappedState from "../types/WrappedState";
import { areConditionsMet } from "./conditions";
import { getDistance } from "./geometry";
import { rangeFromTo } from "./math";

export function findValidPositions(
  state: WrappedState,
  buildFroms: {
    pos: Pos;
    range: number;
  }[],
  canPlace: (state: RawState, pos: Pos) => boolean
): Pos[] {
  const results: Pos[] = [];
  for (const buildFrom of buildFroms) {
    for (const dx of rangeFromTo(-buildFrom.range, buildFrom.range + 1)) {
      for (const dy of rangeFromTo(-buildFrom.range, buildFrom.range + 1)) {
        const pos = { x: buildFrom.pos.x + dx, y: buildFrom.pos.y + dy };
        if (canPlace(state.raw, pos)) {
          results.push(pos);
        }
      }
    }
  }
  return results;
}

export function canPlaceReflector(state: WrappedState, pos: Pos) {
  const isPositionBlocked = state.select
    .entitiesAtPosition(pos)
    .some((e) => e.blocking && e.blocking.moving);
  const activeProjectors = state.select
    .entitiesWithComps("pos", "projector")
    .filter((e) => areConditionsMet(state, e, e.projector.condition));
  return (
    !isPositionBlocked &&
    activeProjectors.some(
      (projector) =>
        getDistance(pos, projector.pos) <= projector.projector.range
    )
  );
}
