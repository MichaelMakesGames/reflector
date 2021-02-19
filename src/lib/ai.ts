/* eslint-disable import/prefer-default-export */
import * as ROT from "rot-js";
import actions from "~state/actions";
import selectors from "~/state/selectors";
import { Direction, Entity, RawState, Pos, Action } from "~/types";
import { getDistance, arePositionsEqual } from "./geometry";
import WrappedState from "~types/WrappedState";
import renderer from "~renderer";

function isPassable(gameState: RawState, position: Pos) {
  return selectors
    .entitiesAtPosition(gameState, position)
    .every((entity) => !entity.blocking || !entity.blocking.moving);
}

function isDestructibleNonEnemy(gameState: RawState, position: Pos) {
  return selectors
    .entitiesAtPosition(gameState, position)
    .every((entity) =>
      Boolean(
        !entity.blocking ||
          !entity.blocking.moving ||
          (entity.destructible && !entity.ai),
      ),
    );
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function moveToward(state: WrappedState, entity: Entity, to: Pos) {
  if (!entity.pos) return [];
  const direction = getDirectionTowardTarget(entity.pos, to, state);
  if (!direction) return [];
  return [actions.move({ entityId: entity.id, ...direction })];
}

export function getDirectionTowardTarget(
  from: Pos,
  to: Pos,
  state: WrappedState,
  passableFunc = isPassable,
): Direction | null {
  const passable = (x: number, y: number) =>
    (x === from.x && y === from.y) ||
    (x === to.x && y === to.y) ||
    passableFunc(state.raw, { x, y });
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

export function getPath(
  from: Pos,
  to: Pos,
  state: WrappedState,
  passableFunc = isPassable,
): Pos[] | null {
  const passable = (x: number, y: number) =>
    arePositionsEqual(from, { x, y }) || passableFunc(state.raw, { x, y });
  const path: Pos[] = [];
  const aStar = new ROT.Path.AStar(from.x, from.y, passable, { topology: 4 });
  aStar.compute(to.x, to.y, (x, y) => {
    const pos = { x, y };
    if (!arePositionsEqual(pos, from)) {
      path.unshift(pos);
    }
  });
  if (path.length) {
    return path;
  }
  return null;
}

export function getAIActions(entity: Entity, state: WrappedState): Action[] {
  const { ai } = entity;
  if (!ai) return [];

  if (ai.type === "DRONE") {
    if (!entity.pos) return [];
    const { pos } = entity;
    const targets = state.select
      .entitiesWithComps("destructible", "pos")
      .filter((e) => !e.ai);
    targets.sort((a, b) => getDistance(a.pos, pos) - getDistance(b.pos, pos));
    const target = targets[0];
    if (!target) {
      console.warn("no valid target");
      return [];
    }

    if (getDistance(entity.pos, target.pos) <= 1) {
      renderer.bump(entity.id, target.pos);
      return destroyAllAtPos(state, target.pos);
    }
    const direction = getDirectionTowardTarget(
      entity.pos,
      target.pos,
      state,
      isDestructibleNonEnemy,
    );
    if (!direction) return [];
    const targetPos = {
      x: entity.pos.x + direction.dx,
      y: entity.pos.y + direction.dy,
    };
    if (
      state.select.entitiesAtPosition(targetPos).some((e) => e.destructible)
    ) {
      return destroyAllAtPos(state, targetPos);
    }
    return [actions.move({ entityId: entity.id, ...direction })];
  }

  return [];
}

function destroyAllAtPos(state: WrappedState, pos: Pos) {
  const entitiesAtTargetPos = state.select.entitiesAtPosition(pos);
  return entitiesAtTargetPos
    .filter((e) => e.destructible)
    .map((e) => actions.destroy(e.id));
}
