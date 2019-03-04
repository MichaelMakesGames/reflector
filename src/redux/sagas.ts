import { getType, isActionOf } from "typesafe-actions";
import { all, put, select, takeEvery } from "redux-saga/effects";
import nanoid from "nanoid";

import * as actions from "./actions";
import * as selectors from "./selectors";
import { Position, Action } from "../types";
import { PLAYER_ID, WHITE } from "../constants";
import { makeTargetingLaser, reflect, getDistance, isPosEqual } from "./utils";
import { getAIAction } from "./ai";
import { generateMap } from "./mapgen";

function* init() {
  const entities = generateMap();
  for (let entity of entities) {
    yield put(
      actions.addEntity({
        entity
      })
    );
  }
  yield put(
    actions.addEntity({
      entity: {
        id: PLAYER_ID,
        position: { x: 1, y: 2 },
        glyph: { glyph: "@", color: WHITE },
        blocking: {},
        hitPoints: { current: 3, max: 3 }
      }
    })
  );
  yield put(
    actions.addEntity({
      entity: {
        id: nanoid(),
        weapon: {
          power: 3,
          cooldown: 2,
          readyIn: 0,
          slot: 1,
          active: false
        }
      }
    })
  );
}

function* processTurns() {
  const gameState: ReturnType<typeof selectors.gameState> = yield select(
    selectors.gameState
  );
  const entities = selectors.entityList(gameState);
  for (let entity of entities.filter(entity => entity.ai)) {
    const action: Action | null = getAIAction(entity, gameState);
    if (action) {
      yield put(action);
    }
  }
  yield* processCooldowns();
  yield* processPickups();
}

function* processCooldowns() {
  const weapons: ReturnType<typeof selectors.weapons> = yield select(
    selectors.weapons
  );
  for (const entity of weapons) {
    if (entity.weapon) {
      yield put(
        actions.addEntity({
          entity: {
            ...entity,
            weapon: {
              ...entity.weapon,
              readyIn: entity.weapon.readyIn > 0 ? entity.weapon.readyIn - 1 : 0
            }
          }
        })
      );
    }
  }
}

function* processPickups() {
  const gameState: ReturnType<typeof selectors.gameState> = yield select(
    selectors.gameState
  );
  const player = selectors.player(gameState);
  for (let entity of selectors.entityList(gameState)) {
    if (
      player &&
      player.position &&
      entity.pickup &&
      entity.position &&
      isPosEqual(player.position, entity.position)
    ) {
      if (entity.pickup.effect === "NONE") {
        yield put(actions.removeEntity({ entityId: entity.id }));
      }
      if (entity.pickup.effect === "HEAL") {
        yield put(actions.removeEntity({ entityId: entity.id }));
        if (
          player.hitPoints &&
          player.hitPoints.current < player.hitPoints.max
        ) {
          yield put(
            actions.addEntity({
              entity: {
                ...player,
                hitPoints: {
                  ...player.hitPoints,
                  current: player.hitPoints.current + 1
                }
              }
            })
          );
        }
      }
      if (entity.pickup.effect === "RECHARGE") {
        yield put(actions.removeEntity({ entityId: entity.id }));
        for (let weapon of selectors.weapons(gameState)) {
          if (weapon.weapon && weapon.weapon.readyIn) {
            yield put(
              actions.addEntity({
                entity: { ...weapon, weapon: { ...weapon.weapon, readyIn: 0 } }
              })
            );
          }
        }
      } // TODO
      if (entity.pickup.effect === "EQUIP") {
      } // TODO
    }
  }
}

function* targetWeapon(
  action: ReturnType<
    typeof actions.targetWeapon | typeof actions.activateWeapon
  >
) {
  const targetingLasers: ReturnType<
    typeof selectors.targetingLasers
  > = yield select(selectors.targetingLasers);
  yield all(
    targetingLasers.map(laser =>
      put(actions.removeEntity({ entityId: laser.id }))
    )
  );

  const player: ReturnType<typeof selectors.entity> = yield select(
    selectors.entity,
    PLAYER_ID
  );
  let playerPosition = player.position;
  if (!playerPosition) return;

  const activeWeapon: ReturnType<typeof selectors.activeWeapon> = yield select(
    selectors.activeWeapon
  );
  if (!activeWeapon) return;
  const { weapon } = activeWeapon;
  if (!weapon) return;

  const beams = [
    {
      power: weapon.power,
      dx: isActionOf(actions.targetWeapon, action) ? action.payload.dx : 1,
      dy: isActionOf(actions.targetWeapon, action) ? action.payload.dy : 0,
      lastPos: playerPosition
    }
  ];

  while (beams.length) {
    const beam = beams[beams.length - 1];
    beams.pop();
    while (beam.power) {
      const nextPos: Position = {
        x: beam.lastPos.x + beam.dx,
        y: beam.lastPos.y + beam.dy
      };
      const entitiesAtPos: ReturnType<
        typeof selectors.entitiesAtPosition
      > = yield select(selectors.entitiesAtPosition, nextPos);
      const solidEntity = entitiesAtPos.find(entity => !!entity.blocking);
      if (!solidEntity) {
        yield put(
          actions.addEntity({
            entity: makeTargetingLaser(
              nextPos.x,
              nextPos.y,
              beam,
              beam.power,
              false
            )
          })
        );
      } else if (
        solidEntity.splitter &&
        ((solidEntity.splitter.type === "horizontal" && beam.dy) ||
          (solidEntity.splitter.type === "vertical" && beam.dx))
      ) {
        const { splitter } = solidEntity;
        beams.push({
          power: beam.power - 1,
          dx: splitter.type === "horizontal" ? 1 : 0,
          dy: splitter.type === "vertical" ? 1 : 0,
          lastPos: nextPos
        });
        beams.push({
          power: beam.power - 1,
          dx: splitter.type === "horizontal" ? -1 : 0,
          dy: splitter.type === "vertical" ? -1 : 0,
          lastPos: nextPos
        });
        beam.power = 0;
      } else if (solidEntity.reflector) {
        const newDirection = reflect(beam, solidEntity.reflector.type);
        beam.dx = newDirection.dx;
        beam.dy = newDirection.dy;
      } else if (solidEntity.destructible) {
        yield put(
          actions.addEntity({
            entity: makeTargetingLaser(
              nextPos.x,
              nextPos.y,
              beam,
              beam.power,
              true
            )
          })
        );
        beam.power--;
      } else {
        beam.power = 0;
      }
      beam.lastPos = nextPos;
    }
  }
}

function* fireWeapon() {
  const activeWeapon: ReturnType<typeof selectors.activeWeapon> = yield select(
    selectors.activeWeapon
  );
  if (!activeWeapon || !activeWeapon.weapon) return;

  const targetingLasers: ReturnType<
    typeof selectors.targetingLasers
  > = yield select(selectors.targetingLasers);

  for (const laser of targetingLasers) {
    const { position } = laser;
    if (position) {
      const entitiesAtPos: ReturnType<
        typeof selectors.entitiesAtPosition
      > = yield select(selectors.entitiesAtPosition, position);
      yield all(
        entitiesAtPos
          .filter(entity => !!entity.destructible)
          .map(entity => put(actions.removeEntity({ entityId: entity.id })))
      );
    }

    yield put(actions.removeEntity({ entityId: laser.id }));
  }
  yield put(
    actions.addEntity({
      entity: {
        ...activeWeapon,
        weapon: {
          ...activeWeapon.weapon,
          readyIn: activeWeapon.weapon.cooldown + 1,
          active: false
        }
      }
    })
  );
  yield put(actions.playerTookTurn());
}

function* activateThrow(action: ReturnType<typeof actions.activateThrow>) {
  const { entity } = action.payload;
  entity.throwing = { range: 5 };
  yield put(actions.addEntity({ entity }));
}

function* rotateThrow() {
  let entity: ReturnType<typeof selectors.throwingTarget> = yield select(
    selectors.throwingTarget
  );
  if (!entity) return;
  if (entity.reflector && entity.glyph) {
    entity = {
      ...entity,
      reflector: { type: entity.reflector.type === "\\" ? "/" : "\\" },
      glyph: {
        ...entity.glyph,
        glyph: entity.glyph.glyph === "\\" ? "/" : "\\"
      }
    };
  }
  if (entity.splitter && entity.glyph) {
    entity = {
      ...entity,
      splitter: {
        type: entity.splitter.type === "horizontal" ? "vertical" : "horizontal"
      },
      glyph: { ...entity.glyph, glyph: entity.glyph.glyph === "⬍" ? "⬌" : "⬍" }
    };
  }
  yield put(actions.addEntity({ entity }));
}

function* cancelThrow() {
  const entity: ReturnType<typeof selectors.throwingTarget> = yield select(
    selectors.throwingTarget
  );
  if (!entity) return;
  yield put(actions.removeEntity({ entityId: entity.id }));
}

function* executeThrow() {
  const gameState: ReturnType<typeof selectors.gameState> = yield select(
    selectors.gameState
  );
  const entity = selectors.throwingTarget(gameState);
  if (!entity || !entity.position || !entity.throwing) return;
  const player = selectors.player(gameState);
  if (!player || !player.position) return;
  const { position } = entity;
  const distance = getDistance(position, player.position);
  if (distance > entity.throwing.range) return;
  const entitiesAtPosition = selectors.entitiesAtPosition(gameState, position);
  if (entitiesAtPosition.some(e => e.id !== entity.id && !!e.blocking)) return;
  yield put(
    actions.addEntity({
      entity: {
        ...entity,
        throwing: undefined
      }
    })
  );
  yield put(actions.playerTookTurn());
}

function* move(action: ReturnType<typeof actions.move>) {
  const entity: ReturnType<typeof selectors.entity> = yield select(
    selectors.entity,
    action.payload.entityId
  );
  const { position } = entity;
  if (!position) {
    console.warn(
      `Entity with no position ${action.payload.entityId} tried to act ${
        action.type
      }`
    );
    return;
  }
  const newPosition = {
    x: position.x + action.payload.dx,
    y: position.y + action.payload.dy
  };
  const entitiesAtNewPosition: ReturnType<
    typeof selectors.entitiesAtPosition
  > = yield select(selectors.entitiesAtPosition, newPosition);
  if (
    entity.blocking &&
    entitiesAtNewPosition.some(
      other => !!(other.blocking && !(entity.id === PLAYER_ID && other.pickup))
    )
  ) {
    return;
  }
  yield put(
    actions.addEntity({
      entity: {
        ...entity,
        position: newPosition
      }
    })
  );
  if (entity.id === PLAYER_ID) {
    yield put(actions.playerTookTurn());
  }
}

export function* attack(action: ReturnType<typeof actions.attack>) {
  const gameState: ReturnType<typeof selectors.gameState> = yield select(
    selectors.gameState
  );
  const target = selectors.entity(gameState, action.payload.target);
  if (target.hitPoints) {
    yield put(
      actions.addEntity({
        entity: {
          ...target,
          hitPoints: {
            ...target.hitPoints,
            current: target.hitPoints.current - 1
          }
        }
      })
    );
  }
  if (target.destructible) {
    yield put(actions.removeEntity({ entityId: target.id }));
  }
}

export function* rootSaga() {
  yield takeEvery(getType(actions.fireWeapon), fireWeapon);
  yield takeEvery(getType(actions.playerTookTurn), processTurns);
  yield takeEvery(getType(actions.init), init);
  yield takeEvery(
    [getType(actions.activateWeapon), getType(actions.targetWeapon)],
    targetWeapon
  );
  yield takeEvery(getType(actions.activateThrow), activateThrow);
  yield takeEvery(getType(actions.rotateThrow), rotateThrow);
  yield takeEvery(getType(actions.cancelThrow), cancelThrow);
  yield takeEvery(getType(actions.executeThrow), executeThrow);
  yield takeEvery(getType(actions.move), move);
  yield takeEvery(getType(actions.attack), attack);
}
