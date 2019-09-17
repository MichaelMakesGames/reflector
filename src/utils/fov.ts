/* eslint-disable import/prefer-default-export */
import * as ROT from "rot-js";
import { GameState, Pos } from "~/types";
import * as selectors from "~/state/selectors";
import { arePositionsEqual } from "./geometry";

export function computeThrowFOV(
  gameState: GameState,
  pos: Pos,
  range: number,
): Pos[] {
  const results: Pos[] = [];
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
