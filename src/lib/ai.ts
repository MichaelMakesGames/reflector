/* eslint-disable import/prefer-default-export */
import { Required } from "ts-toolbelt/out/Object/Required";
import PriorityQueue from "priorityqueuejs";
import * as ROT from "rot-js";
import { Direction, Entity, Pos } from "../types";
import WrappedState from "../types/WrappedState";
import { createEntityFromTemplate } from "./entities";
import {
  arePositionsEqual,
  fromPosKey,
  getAdjacentPositions,
  getDistance,
  getPositionToDirection,
  getPosKey,
} from "./geometry";
import { sum } from "./math";

interface AStarParams {
  from: Pos;
  to: Pos;
  getCost: (pos: Pos, turns: number) => number;
  fourWay?: boolean;
  includeStart?: boolean;
  includeEnd?: boolean;
  maxCost?: number;
}
function aStar({
  from,
  to,
  getCost,
  fourWay = true,
  includeStart = true,
  includeEnd = true,
  maxCost = 100,
}: AStarParams): null | Pos[] {
  const score: Record<string, number> = {};
  score[getPosKey(from)] = getDistance(from, to, fourWay);

  const distance: Record<string, number> = {};
  distance[getPosKey(from)] = 0;

  const cameFrom: Record<string, string> = {};

  const queue = new PriorityQueue<string>((a, b) => score[b] - score[a]);
  queue.enq(getPosKey(from));

  while (!queue.isEmpty()) {
    const current = queue.deq();

    if (current === getPosKey(to)) {
      const path = [current];
      let previous = cameFrom[current];
      while (previous) {
        path.unshift(previous);
        previous = cameFrom[previous];
      }
      if (!includeStart) path.shift();
      if (!includeEnd && path.length) path.pop();
      return path.map(fromPosKey);
    }

    for (const neighbor of getAdjacentPositions(fromPosKey(current), fourWay)) {
      const neighborKey = getPosKey(neighbor);
      const tentativeScore =
        distance[current] + getCost(neighbor, distance[current] + 1);
      if (
        tentativeScore < maxCost &&
        Number.isFinite(tentativeScore) &&
        tentativeScore <
          (Number.isFinite(distance[neighborKey])
            ? distance[neighborKey]
            : Infinity)
      ) {
        cameFrom[neighborKey] = current;
        distance[neighborKey] = tentativeScore;
        score[neighborKey] =
          tentativeScore + getDistance(neighbor, to, fourWay);
        queue.enq(neighborKey);
      }
    }
  }

  return null;
}

function calculateTargetPriority(
  state: WrappedState,
  actor: Required<Entity, "ai" | "pos">,
  targetPos: Pos
): number | null {
  const distance = getDistance(actor.pos, targetPos, true);
  const numberOfOtherAttackers = state.select
    .entitiesWithComps("ai")
    .filter(
      (e) =>
        e.id !== actor.id &&
        e.ai.target &&
        arePositionsEqual(e.ai.target, targetPos)
    ).length;
  const targetsAtPos = state.select
    .entitiesAtPosition(targetPos)
    .filter(
      (e) => e.destructible && Number.isFinite(e.destructible.attackPriority)
    );
  if (!targetsAtPos.length) return null;
  const prioritySum = sum(
    ...targetsAtPos.map(
      (e) => (e.destructible && e.destructible.attackPriority) || 0
    )
  );
  return prioritySum - distance - numberOfOtherAttackers;
}

function findTarget(
  state: WrappedState,
  actor: Required<Entity, "ai" | "pos">
): Pos | null {
  const potentialTargets = state.select
    .entitiesWithComps("pos", "destructible")
    .filter(
      (e) => e.destructible && Number.isFinite(e.destructible.attackPriority)
    )
    .map((e) => e.pos);
  potentialTargets.sort(
    (a, b) =>
      (calculateTargetPriority(state, actor, b) as number) -
      (calculateTargetPriority(state, actor, a) as number)
  );
  return potentialTargets[0] || null;
}

function actorIsNotBlockedByEntity(
  state: WrappedState,
  actor: Entity,
  entityAtDestination: Entity
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
  entity: Entity
) {
  return Boolean(
    entity.destructible && entity.destructible.attackPriority !== undefined
  );
}

export function getDirectionTowardTarget(
  from: Pos,
  to: Pos,
  actor: Entity,
  state: WrappedState
): Direction | null {
  const aiEntities = state.select.entitiesWithComps("ai", "pos");
  const aiEntityIds = new Set(aiEntities.map((e) => e.id));
  const aiPlannedPositions = new Set(
    aiEntities
      .map((e) =>
        e.ai.plannedActionDirection
          ? getPositionToDirection(e.pos, e.ai.plannedActionDirection)
          : e.pos
      )
      .map(getPosKey)
  );
  const getCost = (pos: Pos): number => {
    const nonAiEntitiesAtPosition = state.select
      .entitiesAtPosition(pos)
      .filter((e) => !aiEntityIds.has(e.id));
    const passable =
      (getDistance(from, pos) > 2 || !aiPlannedPositions.has(getPosKey(pos))) &&
      (arePositionsEqual(pos, from) ||
        arePositionsEqual(pos, to) ||
        nonAiEntitiesAtPosition.every(
          (e) =>
            actorIsNotBlockedByEntity(state, actor, e) ||
            isDestructibleNonEnemy(state, actor, e)
        ));

    if (!passable) return Infinity;
    return (
      (1 +
        Math.max(
          0,
          ...nonAiEntitiesAtPosition.map((e) =>
            e.destructible ? e.destructible.movementCost || 1 : 0
          )
        )) *
      (actor.colonist && !nonAiEntitiesAtPosition.some((e) => e.road) ? 2 : 1)
    );
  };
  const path = aStar({
    from,
    to,
    getCost,
    includeStart: false,
  });
  if (path && path.length) {
    return { dx: path[0].x - from.x, dy: path[0].y - from.y };
  }
  return null;
}

export function getPathWithoutCosts(
  from: Pos,
  to: Pos,
  actor: Entity,
  state: WrappedState,
  passableFunc = actorIsNotBlockedByEntity
): Pos[] | null {
  const passable = (x: number, y: number) =>
    arePositionsEqual(from, { x, y }) ||
    state.select
      .entitiesAtPosition({ x, y })
      .every((e) => passableFunc(state, actor, e));
  const path = aStar({
    from,
    to,
    getCost: (p) => (passable(p.x, p.y) ? 1 : Infinity),
    includeStart: false,
  });
  if (path && path.length) {
    return path;
  }
  return null;
}

export function executePlan(
  state: WrappedState,
  entity: Required<Entity, "ai" | "pos">
): void {
  const { ai, pos, id: entityId } = entity;
  if (ai.plannedAction === "MOVE_OR_ATTACK" && ai.plannedActionDirection) {
    const targetPos = getPositionToDirection(pos, ai.plannedActionDirection);
    const targets = state.select
      .entitiesAtPosition(targetPos)
      .filter((e) => e.shield || e.destructible?.attackPriority !== undefined);
    if (targets.length && ai.type !== "BURROWED") {
      state.audio.playAtPos(
        ROT.RNG.getItem([
          "alien_attack_1",
          "alien_attack_2",
          "alien_attack_3",
          "alien_attack_4",
        ]) || "",
        pos,
        { volume: 2 }
      );
      state.renderer.bump(entityId, targetPos);
      state.act.destroyPos({ target: targetPos, from: pos });
    } else {
      state.act.move({ entityId, ...ai.plannedActionDirection });
    }
  } else if (ai.plannedAction === "DIG") {
    if (ai.type === "BURROWED") {
      state.act.removeEntity(entityId);
      state.act.addEntity(createEntityFromTemplate("ENEMY_BURROWER", { pos }));
    } else if (ai.type === "BURROWER") {
      state.act.removeEntity(entityId);
      state.act.addEntity(createEntityFromTemplate("ENEMY_BURROWED", { pos }));
    }
  }
}

export function clearPlan(
  state: WrappedState,
  entity: Required<Entity, "ai">
): void {
  if (state.select.entityById(entity.id)) {
    state.act.updateEntity({
      id: entity.id,
      ai: { ...entity.ai, plannedAction: null, plannedActionDirection: null },
    });
  }
}

export function makePlan(
  state: WrappedState,
  entity: Required<Entity, "ai" | "pos">
): void {
  const { ai, pos } = entity;
  const target = findTarget(state, entity);
  if (!target) return;

  if (getDistance(pos, target, true) <= 1) {
    if (ai.type === "BURROWED") {
      state.act.updateEntity({
        id: entity.id,
        ai: { ...ai, plannedAction: "DIG" },
      });
      return;
    } else {
      const direction: Direction = {
        dx: target.x - pos.x,
        dy: target.y - pos.y,
      };
      state.act.updateEntity({
        id: entity.id,
        ai: {
          ...ai,
          plannedAction: "MOVE_OR_ATTACK",
          plannedActionDirection: direction,
        },
      });
      return;
    }
  }

  const direction = getDirectionTowardTarget(entity.pos, target, entity, state);
  if (!direction) return;

  if (ai.type === "BURROWER" || ai.type === "BURROWED") {
    const targetPos = getPositionToDirection(pos, direction);
    const targets = state.select
      .entitiesAtPosition(targetPos)
      .filter(
        (e) => e.destructible && e.destructible.attackPriority !== undefined
      );

    if (
      (ai.type === "BURROWER" &&
        !targets.length &&
        getDistance(pos, target, true) > 2) ||
      (ai.type === "BURROWED" && targets.length)
    ) {
      state.act.updateEntity({
        id: entity.id,
        ai: { ...ai, plannedAction: "DIG" },
      });
      return;
    }
  }

  state.act.updateEntity({
    id: entity.id,
    ai: {
      ...ai,
      plannedAction: "MOVE_OR_ATTACK",
      plannedActionDirection: direction,
    },
  });
}
