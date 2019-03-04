import { GameState, Position, Entity, AIType } from "../types";
import { WHITE, RED, RIGHT, DOWN, LEFT, UP, GREEN } from "../constants";
import nanoid from "nanoid";

export function getPosKey(pos: Position) {
  return `${pos.x},${pos.y}`;
}

export function isPosEqual(pos1: Position, pos2: Position) {
  return pos1.x === pos2.x && pos1.y === pos2.y;
}

export function getDistance(from: Position, to: Position) {
  return Math.max(Math.abs(from.x - to.x), Math.abs(from.y - to.y));
}

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

export function makeEnemy(x: number, y: number, type: AIType): Entity {
  return {
    id: nanoid(),
    position: { x, y },
    glyph: { glyph: type[0], color: WHITE },
    blocking: {},
    ai: { type },
    destructible: {}
  };
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

export function makeFirstAidKit(x: number, y: number): Entity {
  return {
    id: nanoid(),
    position: { x, y },
    glyph: { glyph: "✚", color: RED },
    pickup: { effect: "HEAL" }
  };
}

export function makeRechargeKit(x: number, y: number): Entity {
  return {
    id: nanoid(),
    position: { x, y },
    glyph: { glyph: "⇮", color: GREEN },
    pickup: { effect: "RECHARGE" }
  };
}
export function makeReflector(x: number, y: number, type: "\\" | "/"): Entity {
  return {
    id: nanoid(),
    position: { x, y },
    glyph: { glyph: type, color: WHITE },
    blocking: {},
    reflector: { type },
    destructible: {},
    pickup: { effect: "NONE" }
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
    splitter: { type },
    pickup: { effect: "NONE" }
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
