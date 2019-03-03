import { getType, isActionOf } from "typesafe-actions";
import { all, put, select, takeEvery } from "redux-saga/effects";
import nanoid from "nanoid";

import * as actions from "./actions";
import * as selectors from "./selectors";
import { PlayerAction, playerActions, Entity, Position } from "../types";
import { PLAYER_ID, WHITE, MAP_WIDTH, MAP_HEIGHT } from "../constants";
import {
  makeWall,
  makeTargetingLaser,
  makeReflector,
  reflect,
  makeSplitter
} from "./utils";

export function* init(action: ReturnType<typeof actions.init>) {
  console.log("init");
  yield put(
    actions.addEntity({
      entity: {
        id: PLAYER_ID,
        position: { x: 1, y: 2 },
        glyph: { glyph: "@", color: WHITE },
        actor: { ready: true },
        blocking: {}
      }
    })
  );
  for (let x = 0; x < MAP_WIDTH; x++) {
    for (let y = 0; y < MAP_HEIGHT; y++) {
      if (x === 0 || y === 0 || x === MAP_WIDTH - 1 || y === MAP_HEIGHT - 1) {
        yield put(
          actions.addEntity({
            entity: makeWall(x, y)
          })
        );
      }
    }
  }
  yield put(
    actions.addEntity({
      entity: makeWall(3, 1, true)
    })
  );
  yield put(
    actions.addEntity({
      entity: makeWall(3, 2, true)
    })
  );
  yield put(
    actions.addEntity({
      entity: makeWall(3, 3, true)
    })
  );
  yield put(
    actions.addEntity({
      entity: makeWall(5, 2, true)
    })
  );
  yield put(
    actions.addEntity({
      entity: makeReflector(1, 5, "\\")
    })
  );
  yield put(
    actions.addEntity({
      entity: makeSplitter(7, 5, "vertical")
    })
  );
  yield put(
    actions.addEntity({
      entity: makeSplitter(5, 5, "horizontal")
    })
  );
  yield put(
    actions.addEntity({
      entity: {
        id: nanoid(),
        position: { x: 7, y: 2 },
        glyph: { glyph: "r", color: WHITE },
        actor: { ready: true },
        blocking: {},
        ai: {},
        destructible: {}
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

export function* processTurns(action: PlayerAction) {
  console.log("processTurns");
  if (action.payload.entityId !== PLAYER_ID) {
    return;
  }
  const player: Entity = yield select(
    selectors.entity,
    action.payload.entityId
  );
  if (!player.actor) {
    console.warn("player missing actor component");
  }
  if (player.actor && !player.actor.ready) {
    console.log("player acted");
    const entities: ReturnType<typeof selectors.entities> = yield select(
      selectors.entities
    );
    yield all(
      Object.values(entities)
        .filter(entity => entity.actor)
        .map(entity => put(actions.ready({ entityId: entity.id })))
    );
    yield all(
      Object.values(entities)
        .filter(entity => entity.actor && entity.ai)
        .map(entity =>
          put(
            actions.move({
              entityId: entity.id,
              dx: Math.floor(Math.random() * 3) - 1,
              dy: Math.floor(Math.random() * 3) - 1
            })
          )
        )
    );
    yield* processEnvironment();
  }
}

export function* processEnvironment() {
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
              readyIn: entity.weapon.readyIn && entity.weapon.readyIn - 1
            }
          }
        })
      );
    }
  }
}

export function* targetWeapon(
  action: ReturnType<
    typeof actions.targetWeapon | typeof actions.activateWeapon
  >
) {
  console.log("targetWeapon");
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

export function* fireWeapon() {
  console.log("fireWeapon");
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
  yield put(actions.fireWeaponSuccess({ entityId: PLAYER_ID }));
}

export function* rootSaga() {
  yield takeEvery(getType(actions.fireWeapon), fireWeapon);
  yield takeEvery(playerActions, processTurns);
  yield takeEvery(getType(actions.init), init);
  yield takeEvery(
    [getType(actions.activateWeapon), getType(actions.targetWeapon)],
    targetWeapon
  );
}
