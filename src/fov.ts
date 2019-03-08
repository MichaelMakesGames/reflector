import { GameState, Position } from "./types";
import * as selectors from "./selectors";
import * as ROT from "rot-js";
import { isPosEqual } from "./utils";

export function computeThrowFOV(
  gameState: GameState,
  pos: Position,
  range: number,
): Position[] {
  const results: Position[] = [];
  const fov = new ROT.FOV.PreciseShadowcasting(
    (x, y) =>
      isPosEqual({ x, y }, pos) ||
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
