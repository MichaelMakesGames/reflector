/* eslint-disable import/prefer-default-export */
import * as ROT from "rot-js";
import { ActionType } from "typesafe-actions";
import * as actions from "~/state/actions";
import {
  ANGLER_RANGE,
  BOMBER_COOLDOWN,
  BOMBER_RANGE,
  PLAYER_ID,
} from "~/constants";
import * as selectors from "~/state/selectors";
import { createEntityFromTemplate } from "./entities";
import { Direction, Entity, GameState, Pos } from "~/types";
import {
  getAdjacentPositions,
  getClosestPosition,
  getDistance,
  arePositionsEqual,
} from "./geometry";

const aiActions = {
  move: actions.move,
  attack: actions.attack,
  addEntity: actions.addEntity,
  updateEntity: actions.updateEntity,
};
type AIAction = ActionType<typeof aiActions>;

function isPassable(gameState: GameState, position: Pos) {
  return selectors
    .entitiesAtPosition(gameState, position)
    .every(entity => !entity.blocking || !entity.blocking.moving);
}

function isDestructibleNonEnemy(gameState: GameState, position: Pos) {
  return selectors
    .entitiesAtPosition(gameState, position)
    .every(entity =>
      Boolean(
        !entity.blocking ||
          !entity.blocking.moving ||
          (entity.destructible && !entity.ai),
      ),
    );
}

function moveToward(gameState: GameState, entity: Entity, to: Pos) {
  if (!entity.pos) return [];
  const direction = getDirectionTowardTarget(entity.pos, to, gameState);
  if (!direction) return [];
  return [actions.move({ entityId: entity.id, ...direction })];
}

function getDirectionTowardTarget(
  from: Pos,
  to: Pos,
  gameState: GameState,
  passableFunc = isPassable,
): Direction | null {
  const passable = (x: number, y: number) =>
    (x === from.x && y === from.y) ||
    (x === to.x && y === to.y) ||
    passableFunc(gameState, { x, y });
  const path: Pos[] = [];
  const aStar = new ROT.Path.AStar(to.x, to.y, passable);
  aStar.compute(from.x, from.y, (x, y) => {
    const pos = { x, y };
    if (!arePositionsEqual(pos, from)) {
      path.push(pos);
    }
  });
  if (path.length) {
    return { dx: path[0].x - from.x, dy: path[0].y - from.y };
  }
  return null;
}

export function getAIActions(entity: Entity, gameState: GameState): AIAction[] {
  const { ai } = entity;
  if (!ai) return [];
  const player = selectors.player(gameState);

  if (ai.type === "RUSHER") {
    if (!player || !entity.pos) {
      return [];
    }
    if (getDistance(entity.pos, player.pos) <= 1) {
      return [
        actions.attack({
          target: player.id,
          message: "The Rusher attacks you!",
        }),
      ];
    }
    const direction = getDirectionTowardTarget(
      entity.pos,
      player.pos,
      gameState,
      isDestructibleNonEnemy,
    );
    if (!direction) return [];
    const targetPos = {
      x: entity.pos.x + direction.dx,
      y: entity.pos.y + direction.dy,
    };
    const entitiesAtTargetPos = selectors.entitiesAtPosition(
      gameState,
      targetPos,
    );
    const destructibleAtTargetPos = entitiesAtTargetPos.find(
      e => !!e.destructible,
    );
    if (destructibleAtTargetPos) {
      return [
        actions.attack({
          target: destructibleAtTargetPos.id,
          message: "The Rusher attacks you!",
        }),
      ];
    }
    return [actions.move({ entityId: entity.id, ...direction })];
  }

  if (ai.type === "SMASHER") {
    if (!entity.pos) return [];
    const reflectorsAndSplittersAndPlayer = selectors
      .entityList(gameState)
      .filter(e => e.reflector || e.splitter || e.id === PLAYER_ID);

    const adjacent = reflectorsAndSplittersAndPlayer.find(
      e => !!(e.pos && entity.pos && getDistance(e.pos, entity.pos) <= 1),
    );
    if (adjacent) {
      return [
        actions.attack({
          target: adjacent.id,
          message: "The Smasher attacks you!",
        }),
      ];
    }

    const closest = reflectorsAndSplittersAndPlayer.sort((a, b) => {
      const aDistance =
        a.pos && entity.pos ? getDistance(a.pos, entity.pos) : Infinity;
      const bDistance =
        b.pos && entity.pos ? getDistance(b.pos, entity.pos) : Infinity;
      return aDistance - bDistance;
    })[0];
    if (closest) {
      if (!closest.pos) return [];
      return moveToward(gameState, entity, closest.pos);
    }
  }

  if (ai.type === "ANGLER") {
    if (!player || !entity.pos) return [];
    const playerPos = player.pos;
    const entityPos = entity.pos;
    if (getDistance(playerPos, entityPos) > ANGLER_RANGE * 2) {
      return moveToward(gameState, entity, playerPos);
    }

    const possiblePositions: Pos[] = [];
    for (let delta = 1; delta <= ANGLER_RANGE; delta++) {
      possiblePositions.push({
        x: playerPos.x + delta,
        y: playerPos.y + delta,
      });
      possiblePositions.push({
        x: playerPos.x + delta,
        y: playerPos.y - delta,
      });
      possiblePositions.push({
        x: playerPos.x - delta,
        y: playerPos.y - delta,
      });
      possiblePositions.push({
        x: playerPos.x - delta,
        y: playerPos.y + delta,
      });
    }
    const attackablePositions = possiblePositions.filter(pos => {
      let dx = pos.x - playerPos.x;
      let dy = pos.y - playerPos.y;
      const dxSign = dx > 0 ? 1 : -1;
      const dySign = dy > 0 ? 1 : -1;
      if (dx === 0) return false;
      dx = (Math.abs(dx) - 1) * dxSign;
      dy = (Math.abs(dy) - 1) * dySign;
      while (dx !== 0) {
        const intermediatePos = { x: playerPos.x + dx, y: playerPos.y + dy };
        if (!isPassable(gameState, intermediatePos)) {
          return false;
        }
        dx = (Math.abs(dx) - 1) * dxSign;
        dy = (Math.abs(dy) - 1) * dySign;
      }
      return true;
    });
    if (attackablePositions.some(pos => arePositionsEqual(pos, entityPos))) {
      return [
        actions.attack({
          target: PLAYER_ID,
          message: "The Angler attacks you!",
        }),
      ];
    }
    const passableAttackablePosition = attackablePositions.filter(pos =>
      isPassable(gameState, pos),
    );
    const closest = getClosestPosition(passableAttackablePosition, entityPos);
    if (!closest) return [];
    return moveToward(gameState, entity, closest);
  }

  if (ai.type === "BOMBER") {
    if (!player || !entity.pos) return [];
    const playerPos = player.pos;
    const entityPos = entity.pos;
    if (getDistance(playerPos, entityPos) > BOMBER_RANGE) {
      return moveToward(gameState, entity, playerPos);
    }

    const { cooldown } = entity;
    if (!cooldown || cooldown.time)
      return moveToward(gameState, entity, playerPos);

    const possiblePositions = getAdjacentPositions(playerPos)
      .filter(pos => isPassable(gameState, pos))
      .filter(pos => getDistance(entityPos, pos) <= BOMBER_RANGE)
      .filter(pos => getDistance(entityPos, pos) > 1);
    if (!possiblePositions.length)
      return moveToward(gameState, entity, playerPos);
    const target = possiblePositions.sort((a, b) => {
      const aNumAdjacentAIs = getAdjacentPositions(a).filter(pos =>
        selectors.entitiesAtPosition(gameState, pos).some(e => !!e.ai),
      ).length;
      const bNumAdjacentAIs = getAdjacentPositions(b).filter(pos =>
        selectors.entitiesAtPosition(gameState, pos).some(e => !!e.ai),
      ).length;
      return aNumAdjacentAIs - bNumAdjacentAIs;
    })[0];
    return [
      actions.addEntity({
        entity: createEntityFromTemplate("BOMB", { pos: target }),
      }),
      actions.updateEntity({
        id: entity.id,
        cooldown: { time: BOMBER_COOLDOWN + 1 },
      }),
    ];
  }

  return [];
}
