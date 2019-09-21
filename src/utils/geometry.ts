import { Pos } from "~/types";
import { DOWN, RIGHT, LEFT, UP } from "~/constants";
import { rangeFromTo } from "./math";

export function getPosKey(pos: Pos) {
  return `${pos.x},${pos.y}`;
}

export function arePositionsEqual(pos1: Pos, pos2: Pos) {
  return pos1.x === pos2.x && pos1.y === pos2.y;
}

export function getDistance(from: Pos, to: Pos) {
  return Math.max(Math.abs(from.x - to.x), Math.abs(from.y - to.y));
}

export function getClosestPosition(options: Pos[], to: Pos): Pos | null {
  return (
    [...options].sort((a, b) => {
      const aDistance = getDistance(a, to);
      const bDistance = getDistance(b, to);
      return aDistance - bDistance;
    })[0] || null
  );
}

export function getAdjacentPositions(pos: Pos): Pos[] {
  return getPositionsWithinRange(pos, 1);
}

export function getPositionsWithinRange(pos: Pos, range: number): Pos[] {
  const positions: Pos[] = [];
  for (const dy of rangeFromTo(-1 * range, range + 1)) {
    for (const dx of rangeFromTo(-1 * range, range + 1)) {
      if (dx !== 0 || dy !== 0) {
        positions.push({
          x: pos.x + dx,
          y: pos.y + dy,
        });
      }
    }
  }
  return positions;
}

export function getConstDir(direction: { dx: number; dy: number }) {
  const { dx, dy } = direction;
  if (dx === RIGHT.dx && dy === RIGHT.dy) return RIGHT;
  if (dx === DOWN.dx && dy === DOWN.dy) return DOWN;
  if (dx === LEFT.dx && dy === LEFT.dy) return LEFT;
  if (dx === UP.dx && dy === UP.dy) return UP;
  return direction;
}
