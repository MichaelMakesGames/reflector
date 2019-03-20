import { GameState, Position } from "../types/types";
import * as selectors from "../state/selectors";
import * as ROT from "rot-js";
import { arePositionsEqual } from "./misc";

export function computeThrowFOV(
  gameState: GameState,
  pos: Position,
  range: number,
): Position[] {
  const results: Position[] = [];
  const fov = new ROT.FOV.PreciseShadowcasting(
    (x, y) =>
      arePositionsEqual({ x, y }, pos) ||
      selectors
        .entitiesAtPosition(gameState, { x, y })
        .every(e => !e.blocking || !e.blocking.throwing),
  );
  fov.compute(pos.x, pos.y, range, (x, y) => results.push({ x, y }));
  return results.filter(pos =>
    selectors
      .entitiesAtPosition(gameState, pos)
      .every(e => !e.blocking || !e.blocking.moving),
  );
}
