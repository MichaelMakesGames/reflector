import { GameState, Direction, Pos } from "~types";
import * as actions from "../actions";
import * as selectors from "../selectors";
import {
  getConstDir,
  isPositionInMap,
  arePositionsEqual,
} from "~utils/geometry";
import { UP, DOWN } from "~constants";
import { rangeFromTo } from "~utils/math";
import handleAction, { registerHandler } from "~state/handleAction";

function movePlacement(
  prevState: GameState,
  action: ReturnType<typeof actions.movePlacement>,
): GameState {
  let state = prevState;
  const placingTarget = selectors.placingTarget(state);
  if (!placingTarget || !placingTarget.pos) return state;
  const currentPos = placingTarget.pos;
  const validPositions = selectors
    .entitiesWithComps(state, "validMarker", "pos")
    .map(e => e.pos);

  const { direction } = action.payload;
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
      state = handleAction(
        state,
        actions.move({
          entityId: placingTarget.id,
          dx: validPosition.x - currentPos.x,
          dy: validPosition.y - currentPos.y,
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
  perpedicularCoord: "x" | "y",
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
      [perpedicularCoord]: middlePos[perpedicularCoord] + perpendicularDelta,
    });
    unfilteredPositions.push({
      ...middlePos,
      [perpedicularCoord]: middlePos[perpedicularCoord] - perpendicularDelta,
    });
  }
  return unfilteredPositions.filter(isPositionInMap);
}
