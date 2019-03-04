import { Entity, GameState, Action, Position, Direction } from "../types";
import * as actions from "./actions";
import * as selectors from "./selectors";
import * as ROT from "rot-js";
import { getDistance, isPosEqual } from "./utils";

function getDirectionTowardTarget(
  from: Position,
  to: Position,
  gameState: GameState
): Direction | null {
  const passable = (x: number, y: number) =>
    (x === from.x && y === from.y) ||
    (x === to.x && y === to.y) ||
    selectors
      .entitiesAtPosition(gameState, { x, y })
      .every(entity => !entity.blocking);
  const path: Position[] = [];
  const aStar = new ROT.Path.AStar(to.x, to.y, passable);
  aStar.compute(from.x, from.y, (x, y) => {
    const pos = { x, y };
    if (!isPosEqual(pos, from) && !isPosEqual(pos, to)) {
      path.push(pos);
    }
  });
  if (path.length) {
    return { dx: path[0].x - from.x, dy: path[0].y - from.y };
  }
  return null;
}

export function getAIAction(
  entity: Entity,
  gameState: GameState
): Action | null {
  const ai = entity.ai;
  if (!ai) return null;

  if (ai.type === "RUSHER") {
    const player = selectors.player(gameState);
    if (!player || !player.position || !entity.position) return null;
    if (getDistance(entity.position, player.position) <= 1) {
      return actions.attack({ target: player.id });
    }
    const direction = getDirectionTowardTarget(
      entity.position,
      player.position,
      gameState
    );
    if (!direction) return null;
    return actions.move({ entityId: entity.id, ...direction });
  }

  return null;
}
