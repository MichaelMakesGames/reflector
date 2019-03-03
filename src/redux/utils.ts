import { GameState, Position, Entity } from "../types";
import * as selectors from "./selectors";
import { WHITE, RED, RIGHT, DOWN, LEFT, UP } from "../constants";
import nanoid from "nanoid";

export function makeWall(x: number, y: number, destructible = false): Entity {
  const base: Entity = {
    id: nanoid(),
    position: { x, y },
    glyph: { glyph: "#", color: WHITE },
    blocking: {}
  };
  if (destructible) return { ...base, destructible: {} };
  return base;
}

function getLaserChar(power: number, direction: { dx: number; dy: number }) {
  const index = power > 3 ? 2 : power - 1;
  if (getConstDir(direction) === RIGHT) return "→⇒⇛"[index];
  if (getConstDir(direction) === DOWN) return "↓⇓⤋"[index];
  if (getConstDir(direction) === LEFT) return "←⇐⇚"[index];
  if (getConstDir(direction) === UP) return "↑⇑⤊"[index];
  return "*";
}
export function makeTargetingLaser(
  x: number,
  y: number,
  direction: { dx: number; dy: number },
  power: number,
  hit: boolean
): Entity {
  return {
    id: nanoid(),
    position: { x, y },
    glyph: { glyph: hit ? "*" : getLaserChar(power, direction), color: RED },
    targeting: {}
  };
}

export function makeReflector(x: number, y: number, type: "\\" | "/"): Entity {
  return {
    id: nanoid(),
    position: { x, y },
    glyph: { glyph: type, color: WHITE },
    blocking: {},
    reflector: { type },
    destructible: {}
  };
}

export function makeSplitter(
  x: number,
  y: number,
  type: "horizontal" | "vertical"
): Entity {
  return {
    id: nanoid(),
    position: { x, y },
    glyph: { glyph: type === "horizontal" ? "⬌" : "⬍", color: WHITE },
    blocking: {},
    destructible: {},
    splitter: { type }
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
  reflectorType: "\\" | "/"
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
