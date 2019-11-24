import colors from "~colors";
import { DOWN, UP } from "~constants";
import { registerHandler } from "~state/handleAction";
import { Direction, Pos } from "~types";
import WrappedState from "~types/WrappedState";
import {
  arePositionsEqual,
  getConstDir,
  isPositionInMap,
} from "~utils/geometry";
import { rangeFromTo } from "~utils/math";
import actions from "../actions";

function movePlacement(
  state: WrappedState,
  action: ReturnType<typeof actions.movePlacement>,
): void {
  const placingTarget = state.select.placingTarget();
  const placingMarker = state.select.placingMarker();
  if (!placingTarget || !placingTarget.pos || !placingMarker) return;
  const currentPos = placingTarget.pos;
  const validPositions = state.select
    .entitiesWithComps("validMarker", "pos")
    .map(e => e.pos);
  const { direction } = action.payload;

  if (!action.payload.jumpToValid) {
    const newPos = {
      x: currentPos.x + direction.dx,
      y: currentPos.y + direction.dy,
    };
    const isValid = validPositions.some(validPos =>
      arePositionsEqual(validPos, newPos),
    );
    state.act.updateEntity({
      ...placingTarget,
      pos: newPos,
    });
    state.act.updateEntity({
      ...placingMarker,
      display: {
        ...placingMarker.display,
        color: isValid ? colors.secondary : colors.invalid,
      },
      pos: newPos,
    });
    return;
  }

  const constDir = getConstDir(direction);
  const perpendicularCoord: "x" | "y" =
    constDir === UP || constDir === DOWN ? "x" : "y";

  let range = 1;
  let perpendicularRange = 1;

  while (true) {
    const positionsToCheck = getPositionsToCheck(
      currentPos,
      constDir,
      perpendicularCoord,
      range,
      perpendicularRange,
    );
    if (!positionsToCheck.length) {
      break;
    }
    const validPosition = positionsToCheck.find(pos =>
      validPositions.some(validPos => arePositionsEqual(validPos, pos)),
    );
    if (validPosition) {
      const dx = validPosition.x - currentPos.x;
      const dy = validPosition.y - currentPos.y;
      state.act.move({
        entityId: placingTarget.id,
        dx,
        dy,
      });
      state.act.updateEntity({
        ...placingMarker,
        display: {
          ...placingMarker.display,
          color: colors.secondary,
        },
        pos: validPosition,
      });
      break;
    }
    range += 1;
    perpendicularRange += 1;
  }
}

registerHandler(movePlacement, actions.movePlacement);

function getPositionsToCheck(
  currentPos: Pos,
  direction: Direction,
  perpendicularCoord: "x" | "y",
  range: number,
  perpendicularRange: number,
): Pos[] {
  const middlePos = {
    x: currentPos.x + direction.dx * range,
    y: currentPos.y + direction.dy * range,
  };
  const unfilteredPositions = [middlePos];
  for (const perpendicularDelta of rangeFromTo(1, perpendicularRange + 1)) {
    unfilteredPositions.push({
      ...middlePos,
      [perpendicularCoord]: middlePos[perpendicularCoord] + perpendicularDelta,
    });
    unfilteredPositions.push({
      ...middlePos,
      [perpendicularCoord]: middlePos[perpendicularCoord] - perpendicularDelta,
    });
  }
  return unfilteredPositions.filter(isPositionInMap);
}
