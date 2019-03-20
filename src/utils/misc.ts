import { Position, WeaponType, Direction, Glyph } from "../types/types";
import {
  RED,
  RIGHT,
  DOWN,
  LEFT,
  UP,
  PRIORITY_LASER,
  PURPLE,
  YELLOW,
} from "../constants";
import nanoid from "nanoid";
import * as ROT from "rot-js";

export function getPosKey(pos: Position) {
  return `${pos.x},${pos.y}`;
}

export function arePositionsEqual(pos1: Position, pos2: Position) {
  return pos1.x === pos2.x && pos1.y === pos2.y;
}

export function getDistance(from: Position, to: Position) {
  return Math.max(Math.abs(from.x - to.x), Math.abs(from.y - to.y));
}

export function getClosestPosition(
  options: Position[],
  to: Position,
): Position | null {
  return (
    [...options].sort((a, b) => {
      const aDistance = getDistance(a, to);
      const bDistance = getDistance(b, to);
      return aDistance - bDistance;
    })[0] || null
  );
}

export function getAdjacentPositions(pos: Position): Position[] {
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

function getLaserChar(power: number, direction: { dx: number; dy: number }) {
  const index = power > 3 ? 2 : power - 1;
  if (getConstDir(direction) === RIGHT) return "→⇒⇛"[index];
  if (getConstDir(direction) === DOWN) return "↓⇓⤋"[index];
  if (getConstDir(direction) === LEFT) return "←⇐⇚"[index];
  if (getConstDir(direction) === UP) return "↑⇑⤊"[index];
  return "*";
}
export function getLaserGlyph(
  direction: Direction,
  power: number,
  hit: boolean,
  type: WeaponType,
): Glyph {
  let color = RED;
  if (type === "TELEPORT") color = PURPLE;
  if (type === "ELECTRIC") color = YELLOW;
  return {
    glyph: hit ? "*" : getLaserChar(power, direction),
    color,
    priority: PRIORITY_LASER,
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

export function reflect(
  direction: { dx: number; dy: number },
  reflectorType: "\\" | "/",
): { dx: number; dy: number } {
  const d = direction;
  if (reflectorType === "\\") {
    if (getConstDir(d) === RIGHT) return DOWN;
    if (getConstDir(d) === DOWN) return RIGHT;
    if (getConstDir(d) === LEFT) return UP;
    if (getConstDir(d) === UP) return LEFT;
    return direction;
  } else {
    if (getConstDir(d) === RIGHT) return UP;
    if (getConstDir(d) === DOWN) return LEFT;
    if (getConstDir(d) === LEFT) return DOWN;
    if (getConstDir(d) === UP) return RIGHT;
    return direction;
  }
}
