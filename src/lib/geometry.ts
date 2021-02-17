import { Pos, Direction } from "~/types";
import { DOWN, RIGHT, LEFT, UP, MAP_WIDTH, MAP_HEIGHT } from "~/constants";
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

export function getPositionToDirection(pos: Pos, direction: Direction) {
  return {
    x: pos.x + direction.dx,
    y: pos.y + direction.dy,
  };
}

export function getConstDir(direction: { dx: number; dy: number }) {
  const { dx, dy } = direction;
  if (dx === RIGHT.dx && dy === RIGHT.dy) return RIGHT;
  if (dx === DOWN.dx && dy === DOWN.dy) return DOWN;
  if (dx === LEFT.dx && dy === LEFT.dy) return LEFT;
  if (dx === UP.dx && dy === UP.dy) return UP;
  return direction;
}

export function areDirectionsEqual(d1: Direction, d2: Direction) {
  return d1.dx === d2.dx && d1.dy === d2.dy;
}

export function isPositionInMap(position: Pos) {
  return (
    position.x >= 0 &&
    position.x < MAP_WIDTH &&
    position.y >= 0 &&
    position.y < MAP_HEIGHT
  );
}

export function getClosest<T extends { pos: Pos }>(
  choices: T[],
  position: Pos,
): T {
  return [...choices].sort(
    (a, b) => getDistance(a.pos, position) - getDistance(b.pos, position),
  )[0];
}

export function getHumanReadablePosition(pos: Pos) {
  const northSouth =
    pos.y < MAP_HEIGHT / 2
      ? `${Math.abs(pos.y - MAP_HEIGHT / 2)}N`
      : `${pos.y - MAP_HEIGHT / 2 + 1}S`;
  const eastWest =
    pos.x < MAP_WIDTH / 2
      ? `${Math.abs(pos.x - MAP_WIDTH / 2)}W`
      : `${pos.x - MAP_WIDTH / 2 + 1}E`;
  return `${northSouth}, ${eastWest}`;
}
