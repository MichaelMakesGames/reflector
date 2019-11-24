import { GameState, Direction, Pos } from "~types";
import actions from "../actions";
import selectors from "../selectors";
import {
  getConstDir,
  isPositionInMap,
  arePositionsEqual,
} from "~utils/geometry";
import { UP, DOWN } from "~constants";
import { rangeFromTo } from "~utils/math";
import handleAction, { registerHandler } from "~state/handleAction";
import colors from "~colors";

function movePlacement(
  prevState: GameState,
  action: ReturnType<typeof actions.movePlacement>,
): GameState {
  let state = prevState;
  const placingTarget = selectors.placingTarget(state);
  const placingMarker = selectors.placingMarker(state);
  if (!placingTarget || !placingTarget.pos || !placingMarker) return state;
  const currentPos = placingTarget.pos;
  const validPositions = selectors
    .entitiesWithComps(state, "validMarker", "pos")
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
    state = handleAction(
      state,
      actions.updateEntity({
        ...placingTarget,
        pos: newPos,
      }),
    );
    state = handleAction(
      state,
      actions.updateEntity({
        ...placingMarker,
        display: {
          ...placingMarker.display,
          color: isValid ? colors.secondary : colors.invalid,
        },
        pos: newPos,
      }),
    );
    return state;
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
      state = handleAction(
        state,
        actions.move({
          entityId: placingTarget.id,
          dx,
          dy,
        }),
      );
      state = handleAction(
        state,
        actions.updateEntity({
          ...placingMarker,
          display: {
            ...placingMarker.display,
            color: colors.secondary,
          },
          pos: validPosition,
        }),
      );
      break;
    }
    range += 1;
    perpendicularRange += 1;
  }
  return state;
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
