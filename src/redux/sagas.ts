import { getType, isActionOf } from "typesafe-actions";
import { all, put, select, takeEvery } from "redux-saga/effects";
import nanoid from "nanoid";
import * as ROT from "rot-js";

import * as actions from "./actions";
import * as selectors from "./selectors";
import { Position, Action, Level } from "../types";
import { PLAYER_ID, WHITE, THROWING_RANGE } from "../constants";
import {
  makeTargetingLaser,
  reflect,
  getDistance,
  isPosEqual,
  getAdjacentPositions,
  makeFovMarker
} from "./utils";
import { getAIActions } from "./ai";
import { generateMap } from "./mapgen";
import { computeFOV } from "./fov";
import { getLevels } from "./levels";

function* init() {
  const levels = getLevels();
  for (let level of levels) {
    yield put(actions.addEntity({ entity: { id: nanoid(), level } }));
  }

  yield put(
    actions.addEntity({
      entity: {
        id: PLAYER_ID,
        position: { x: 1, y: 1 },
        glyph: { glyph: "@", color: WHITE },
        blocking: {},
        hitPoints: { current: 3, max: 3 },
        inventory: { reflectors: 3, splitters: 1 }
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

  yield* makeLevel();
}

function* makeLevel() {
  const gameState: ReturnType<typeof selectors.gameState> = yield select(
    selectors.gameState
  );
  const lastLevelEntity = selectors
    .entityList(gameState)
    .filter(e => e.level && e.level.current)[0];
  if (!lastLevelEntity || !lastLevelEntity.level) return;
  const lastLevel = lastLevelEntity.level;
  const nextLevelEntity = selectors
    .entityList(gameState)
    .filter(e => e.level && e.level.depth === lastLevel.depth + 1)[0];
  if (!nextLevelEntity || !nextLevelEntity.level) return;
  const nextLevel = nextLevelEntity.level;

  yield put(
    actions.addEntity({
      entity: { ...lastLevelEntity, level: { ...lastLevel, current: false } }
    })
  );
  yield put(
    actions.addEntity({
      entity: { ...nextLevelEntity, level: { ...nextLevel, current: true } }
    })
  );

  for (let entity of selectors.entityList(gameState)) {
    if (entity.position && entity.id !== PLAYER_ID) {
      yield put(actions.removeEntity({ entityId: entity.id }));
    } else if (entity.id === PLAYER_ID) {
      // yield put(
      //   actions.addEntity({ entity: { ...entity, position: { x: 1, y: 1 } } })
      // );
    }
  }

  for (let entity of generateMap(nextLevel)) {
    yield put(actions.addEntity({ entity }));
  }
}

function* processTurns() {
  yield* processAI();
  yield* processBombs();
  yield* processCooldowns();
  yield* processPickups();
  yield* processStairs();
}

function* processAI() {
  const gameState: ReturnType<typeof selectors.gameState> = yield select(
    selectors.gameState
  );
  const entities = selectors.entityList(gameState);
  for (let entity of entities.filter(entity => entity.ai)) {
    const aiActions = getAIActions(entity, gameState);
    for (let action of aiActions) {
      yield put(action);
    }
  }
}

function* processStairs() {
  const gameState: ReturnType<typeof selectors.gameState> = yield select(
    selectors.gameState
  );
  const player = selectors.player(gameState);
  const stairs = selectors.entityList(gameState).filter(e => e.stairs)[0];
  if (!player || !stairs || !player.position || !stairs.position) return;
  if (isPosEqual(player.position, stairs.position)) {
    yield* makeLevel();
  }
}

function* processBombs() {
  const gameState: ReturnType<typeof selectors.gameState> = yield select(
    selectors.gameState
  );
  for (let entity of selectors.entityList(gameState)) {
    if (entity.bomb && entity.position) {
      if (entity.bomb.time <= 0 && entity) {
        yield put(actions.removeEntity({ entityId: entity.id }));
        for (let pos of getAdjacentPositions(entity.position)) {
          for (let e of selectors.entitiesAtPosition(gameState, pos)) {
            if (e.hitPoints || e.destructible) {
              yield put(actions.attack({ target: e.id }));
            }
          }
        }
      } else {
        yield put(
          actions.addEntity({
            entity: {
              ...entity,
              bomb: { time: entity.bomb.time - 1 }
            }
          })
        );
      }
    }
  }
}

function* processCooldowns() {
  const gameState: ReturnType<typeof selectors.gameState> = yield select(
    selectors.gameState
  );
  for (const entity of selectors
    .entityList(gameState)
    .filter(e => e.cooldown)) {
    if (entity.cooldown) {
      yield put(
        actions.addEntity({
          entity: {
            ...entity,
            cooldown: { time: entity.cooldown.time && entity.cooldown.time - 1 }
          }
        })
      );
    }
  }
  for (const entity of selectors.weapons(gameState)) {
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
      if (entity.pickup.effect === "PICKUP") {
        yield put(actions.removeEntity({ entityId: entity.id }));
        if (player.inventory) {
          yield put(
            actions.addEntity({
              entity: {
                ...player,
                inventory: {
                  reflectors:
                    player.inventory.reflectors + (entity.reflector ? 1 : 0),
                  splitters:
                    player.inventory.splitters + (entity.splitter ? 1 : 0)
                }
              }
            })
          );
        }
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
      }
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
  const gameState: ReturnType<typeof selectors.gameState> = yield select(
    selectors.gameState
  );
  const player = selectors.player(gameState);
  if (!player || !player.position) return;

  const fovPositions = computeFOV(gameState, player.position, THROWING_RANGE);
  for (let pos of fovPositions) {
    yield put(actions.addEntity({ entity: makeFovMarker(pos.x, pos.y) }));
  }

  const { entity } = action.payload;
  entity.throwing = { range: THROWING_RANGE };
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
  const gameState: ReturnType<typeof selectors.gameState> = yield select(
    selectors.gameState
  );
  for (let entity of selectors.entityList(gameState).filter(e => e.fov)) {
    yield put(actions.removeEntity({ entityId: entity.id }));
  }
  const entity = selectors.throwingTarget(gameState);
  if (!entity) return;
  yield put(actions.removeEntity({ entityId: entity.id }));
}

function* executeThrow() {
  const gameState: ReturnType<typeof selectors.gameState> = yield select(
    selectors.gameState
  );
  for (let entity of selectors.entityList(gameState).filter(e => e.fov)) {
    yield put(actions.removeEntity({ entityId: entity.id }));
  }
  const entity = selectors.throwingTarget(gameState);
  if (!entity || !entity.position || !entity.throwing) return;
  const player = selectors.player(gameState);
  if (!player || !player.position || !player.inventory) return;
  const { inventory } = player;
  if (entity.reflector && !inventory.reflectors) return;
  if (entity.splitter && !inventory.splitters) return;
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
  yield put(
    actions.addEntity({
      entity: {
        ...player,
        inventory: {
          splitters: entity.splitter
            ? inventory.splitters - 1
            : inventory.splitters,
          reflectors: entity.reflector
            ? inventory.reflectors - 1
            : inventory.reflectors
        }
      }
    })
  );
}

function* move(action: ReturnType<typeof actions.move>) {
  const entity: ReturnType<typeof selectors.entity> = yield select(
    selectors.entity,
    action.payload.entityId
  );
  const { position } = entity;
  if (!position) {
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
    !entity.throwing &&
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
