import { Pos } from "~/types";
import { DOWN, RIGHT, LEFT, UP } from "~/constants";

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
  return [
    { x: pos.x + 1, y: pos.y },
    { x: pos.x - 1, y: pos.y },
    { y: pos.y + 1, x: pos.x },
    { y: pos.y - 1, x: pos.x },
    { x: pos.x + 1, y: pos.y + 1 },
    { x: pos.x - 1, y: pos.y + 1 },
    { x: pos.x + 1, y: pos.y - 1 },
    { x: pos.x - 1, y: pos.y - 1 },
  ];
}

export function getConstDir(direction: { dx: number; dy: number }) {
  const { dx, dy } = direction;
  if (dx === RIGHT.dx && dy === RIGHT.dy) return RIGHT;
  if (dx === DOWN.dx && dy === DOWN.dy) return DOWN;
  if (dx === LEFT.dx && dy === LEFT.dy) return LEFT;
  if (dx === UP.dx && dy === UP.dy) return UP;
  return direction;
}
