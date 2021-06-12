/* eslint-disable import/prefer-default-export */
import * as ROT from "rot-js";
import { Action, Direction, Entity, Pos } from "~/types";
import renderer from "~renderer";
import actions from "~state/actions";
import WrappedState from "~types/WrappedState";
import audio from "./audio";
import { arePositionsEqual, getDistance } from "./geometry";
import { createEntityFromTemplate } from "./entities";

function isPassable(
  state: WrappedState,
  actor: Entity,
  entityAtDestination: Entity,
) {
  return (
    !entityAtDestination.blocking ||
    !entityAtDestination.blocking.moving ||
    (state.select.canFly(actor) && state.select.isFlyable(entityAtDestination))
  );
}

function isDestructibleNonEnemy(
  state: WrappedState,
  actor: Entity,
  entity: Entity,
) {
  return Boolean(entity.destructible && !entity.ai);
}

export function getDirectionTowardTarget(
  from: Pos,
  to: Pos,
  actor: Entity,
  state: WrappedState,
  passableFunc: (
    state: WrappedState,
    actor: Entity,
    entityAtPos: Entity,
  ) => boolean = isPassable,
): Direction | null {
  const passable = (x: number, y: number) =>
    (x === from.x && y === from.y) ||
    (x === to.x && y === to.y) ||
    state.select
      .entitiesAtPosition({ x, y })
      .every((e) => passableFunc(state, actor, e));
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
  actor: Entity,
  state: WrappedState,
  passableFunc = isPassable,
): Pos[] | null {
  const passable = (x: number, y: number) =>
    arePositionsEqual(from, { x, y }) ||
    state.select
      .entitiesAtPosition({ x, y })
      .every((e) => passableFunc(state, actor, e));
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
    if (ai.type === "BURROWED") {
      return [
        actions.removeEntity(entity.id),
        actions.addEntity(createEntityFromTemplate("ENEMY_BURROWER", { pos })),
      ];
    } else {
      renderer.bump(entity.id, target.pos);
      return destroyAllAtPos(state, target.pos);
    }
  } else if (ai.type === "BURROWER") {
    return [
      actions.removeEntity(entity.id),
      actions.addEntity(createEntityFromTemplate("ENEMY_BURROWED", { pos })),
    ];
  }

  const direction = getDirectionTowardTarget(
    entity.pos,
    target.pos,
    entity,
    state,
    (...args) => isPassable(...args) || isDestructibleNonEnemy(...args),
  );
  if (!direction) return [];
  const targetPos = {
    x: entity.pos.x + direction.dx,
    y: entity.pos.y + direction.dy,
  };
  if (state.select.entitiesAtPosition(targetPos).some((e) => e.destructible)) {
    return destroyAllAtPos(state, targetPos);
  }
  return [actions.move({ entityId: entity.id, ...direction })];
}

function destroyAllAtPos(state: WrappedState, pos: Pos) {
  const entitiesAtTargetPos = state.select.entitiesAtPosition(pos);
  audio.playAtPos(
    ROT.RNG.getItem([
      "alien_attack_1",
      "alien_attack_2",
      "alien_attack_3",
      "alien_attack_4",
    ]) || "",
    pos,
    { volume: 2 },
  );
  return entitiesAtTargetPos
    .filter((e) => e.destructible)
    .map((e) => actions.destroy(e.id));
}
