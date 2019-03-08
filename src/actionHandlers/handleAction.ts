import { getType, isActionOf } from "typesafe-actions";
import nanoid from "nanoid";
import * as ROT from "rot-js";

import * as actions from "../actions";
import * as selectors from "../selectors";
import { Position, Action, Level, GameState, Entity } from "../types";
import {
  PLAYER_ID,
  WHITE,
  THROWING_RANGE,
  RIGHT,
  PRIORITY_LASER,
  PRIORITY_PLAYER,
} from "../constants";
import {
  reflect,
  getDistance,
  isPosEqual,
  getAdjacentPositions,
  getPosKey,
  getLaserGlyph,
} from "../utils";
import { getAIActions } from "../ai";
import { generateMap } from "../mapgen";
import { computeThrowFOV } from "../fov";
import { getLevels } from "../levels";
import { createEntityFromTemplate } from "../templates";

function init(state: GameState, action: Action): GameState {
  const levels = getLevels();
  for (let level of levels) {
    state = handleAction(
      state,
      actions.addEntity({ entity: { id: nanoid(), level } }),
    );
  }

  state = handleAction(
    state,
    actions.addEntity({
      entity: createEntityFromTemplate("PLAYER"),
    }),
  );
  const startingWeapon = createEntityFromTemplate("WEAPON_LASER");
  if (startingWeapon.weapon) startingWeapon.weapon.slot = 1;
  state = handleAction(state, actions.addEntity({ entity: startingWeapon }));

  state = makeLevel(state);
  return state;
}

function makeLevel(state: GameState): GameState {
  const lastLevelEntity = selectors
    .entityList(state)
    .filter(e => e.level && e.level.current)[0];
  if (!lastLevelEntity || !lastLevelEntity.level) return state;
  const lastLevel = lastLevelEntity.level;
  const nextLevelEntity = selectors
    .entityList(state)
    .filter(e => e.level && e.level.depth === lastLevel.depth + 1)[0];
  if (!nextLevelEntity || !nextLevelEntity.level) return state;
  const nextLevel = nextLevelEntity.level;

  state = handleAction(
    state,
    actions.addEntity({
      entity: { ...lastLevelEntity, level: { ...lastLevel, current: false } },
    }),
  );
  state = handleAction(
    state,
    actions.addEntity({
      entity: { ...nextLevelEntity, level: { ...nextLevel, current: true } },
    }),
  );

  for (let entity of selectors.entityList(state)) {
    if (entity.position && entity.id !== PLAYER_ID) {
      state = handleAction(
        state,
        actions.removeEntity({ entityId: entity.id }),
      );
    }
  }

  for (let entity of generateMap(nextLevel)) {
    state = handleAction(state, actions.addEntity({ entity }));
  }
  return state;
}

function processTurns(state: GameState, action: Action): GameState {
  state = processAI(state);
  state = processBombs(state);
  state = processFactories(state);
  state = processCooldowns(state);
  state = processPickups(state);
  state = processStairs(state);
  state = processGameOver(state);
  return state;
}

function processGameOver(state: GameState): GameState {
  const entities = selectors.entityList(state);
  const player = selectors.player(state);
  const currentLevel = entities.filter(e => e.level && e.level.current)[0];
  if (player && player.hitPoints && player.hitPoints.current <= 0) {
    state = {
      ...state,
      gameOver: true,
      messageLog: [...state.messageLog, "You died. Refresh to try again."],
    };
  } else if (
    currentLevel.level &&
    currentLevel.level.final &&
    entities.filter(e => e.factory).length === 0
  ) {
    state = {
      ...state,
      gameOver: true,
      messageLog: [
        ...state.messageLog,
        "You destroyed all enemy factories. You win!",
      ],
    };
  }
  return state;
}

function processFactories(state: GameState): GameState {
  for (let entity of selectors
    .entityList(state)
    .filter(e => e.factory && e.cooldown && !e.cooldown.time)) {
    if (!entity.factory || !entity.position) continue;
    const emptyAdjacentPositions = getAdjacentPositions(entity.position).filter(
      pos => selectors.entitiesAtPosition(state, pos).every(e => !e.blocking),
    );
    if (!emptyAdjacentPositions.length) continue;
    const choice =
      emptyAdjacentPositions[
        Math.floor(Math.random() * emptyAdjacentPositions.length)
      ];
    state = handleAction(
      state,
      actions.addEntity({
        entity: createEntityFromTemplate(entity.factory.type, {
          position: choice,
        }),
      }),
    );
    state = handleAction(
      state,
      actions.addEntity({
        entity: {
          ...entity,
          cooldown: { time: entity.factory.cooldown + 1 },
        },
      }),
    );
  }
  return state;
}

function processAI(state: GameState): GameState {
  const entities = selectors.entityList(state);
  for (let entity of entities.filter(entity => entity.ai)) {
    const aiActions = getAIActions(entity, state);
    for (let action of aiActions) {
      state = handleAction(state, action);
    }
  }
  return state;
}

function processStairs(state: GameState): GameState {
  const player = selectors.player(state);
  const stairs = selectors.entityList(state).filter(e => e.stairs)[0];
  if (!player || !stairs || !player.position || !stairs.position) return state;
  if (isPosEqual(player.position, stairs.position)) {
    state = makeLevel(state);
  }
  return state;
}

function processBombs(state: GameState): GameState {
  for (let entity of selectors.entityList(state)) {
    if (entity.bomb && entity.position) {
      if (entity.bomb.time <= 0 && entity) {
        state = handleAction(
          state,
          actions.removeEntity({ entityId: entity.id }),
        );
        for (let pos of getAdjacentPositions(entity.position)) {
          for (let e of selectors.entitiesAtPosition(state, pos)) {
            if (e.hitPoints || e.destructible) {
              state = handleAction(state, actions.attack({ target: e.id }));
            }
          }
        }
      } else {
        state = handleAction(
          state,
          actions.addEntity({
            entity: {
              ...entity,
              bomb: { time: entity.bomb.time - 1 },
            },
          }),
        );
      }
    }
  }
  return state;
}

function processCooldowns(state: GameState): GameState {
  for (const entity of selectors.entityList(state).filter(e => e.cooldown)) {
    if (entity.cooldown) {
      state = handleAction(
        state,
        actions.addEntity({
          entity: {
            ...entity,
            cooldown: {
              time: entity.cooldown.time && entity.cooldown.time - 1,
            },
          },
        }),
      );
    }
  }
  for (const entity of selectors.weapons(state)) {
    if (entity.weapon) {
      state = handleAction(
        state,
        actions.addEntity({
          entity: {
            ...entity,
            weapon: {
              ...entity.weapon,
              readyIn:
                entity.weapon.readyIn > 0 ? entity.weapon.readyIn - 1 : 0,
            },
          },
        }),
      );
    }
  }
  return state;
}

function processPickups(state: GameState): GameState {
  const player = selectors.player(state);
  for (let entity of selectors.entityList(state)) {
    if (
      player &&
      player.position &&
      entity.pickup &&
      entity.position &&
      isPosEqual(player.position, entity.position)
    ) {
      if (entity.pickup.effect === "NONE") {
        state = handleAction(
          state,
          actions.removeEntity({ entityId: entity.id }),
        );
      }
      if (entity.pickup.effect === "PICKUP") {
        state = handleAction(
          state,
          actions.removeEntity({ entityId: entity.id }),
        );
        if (player.inventory) {
          state = handleAction(
            state,
            actions.addEntity({
              entity: {
                ...player,
                inventory: {
                  reflectors:
                    player.inventory.reflectors + (entity.reflector ? 1 : 0),
                  splitters:
                    player.inventory.splitters + (entity.splitter ? 1 : 0),
                },
              },
            }),
          );
        }
      }
      if (entity.pickup.effect === "HEAL") {
        state = handleAction(
          state,
          actions.removeEntity({ entityId: entity.id }),
        );
        if (
          player.hitPoints &&
          player.hitPoints.current < player.hitPoints.max
        ) {
          state = handleAction(
            state,
            actions.addEntity({
              entity: {
                ...player,
                hitPoints: {
                  ...player.hitPoints,
                  current: player.hitPoints.current + 1,
                },
              },
            }),
          );
          state = {
            ...state,
            messageLog: [...state.messageLog, "You heal 1."],
          };
        }
      }
      if (entity.pickup.effect === "RECHARGE") {
        state = handleAction(
          state,
          actions.removeEntity({ entityId: entity.id }),
        );
        state = {
          ...state,
          messageLog: [...state.messageLog, "All weapons ready."],
        };
        for (let weapon of selectors.weapons(state)) {
          if (weapon.weapon && weapon.weapon.readyIn) {
            state = handleAction(
              state,
              actions.addEntity({
                entity: { ...weapon, weapon: { ...weapon.weapon, readyIn: 0 } },
              }),
            );
          }
        }
      }
      if (entity.pickup.effect === "EQUIP") {
        if (entity.weapon) {
          state = handleAction(state, actions.activateEquip({ entity }));
        }
      }
    }
  }
  return state;
}

function targetWeapon(state: GameState, action: Action): GameState {
  if (!isActionOf(actions.targetWeapon, action)) return state;
  const targetingLasers = selectors.targetingLasers(state);
  for (let entity of targetingLasers) {
    state = handleAction(state, actions.removeEntity({ entityId: entity.id }));
  }

  const player = selectors.entity(state, PLAYER_ID);
  let playerPosition = player.position;
  if (!playerPosition) return state;

  const activeWeapon = selectors.activeWeapon(state);
  if (!activeWeapon) return state;
  const { weapon } = activeWeapon;
  if (!weapon) return state;

  const beams = [
    {
      power: weapon.power,
      dx: action.payload.dx,
      dy: action.payload.dy,
      lastPos: playerPosition,
    },
  ];

  const explosionCenters: Position[] = [];
  const spreadElectricity: Entity[] = [];

  while (beams.length) {
    const beam = beams[beams.length - 1];
    beams.pop();
    while (beam.power) {
      const nextPos: Position = {
        x: beam.lastPos.x + beam.dx,
        y: beam.lastPos.y + beam.dy,
      };
      const entitiesAtPos = selectors.entitiesAtPosition(state, nextPos);
      const solidEntity = entitiesAtPos.find(entity => !!entity.blocking);

      if (!solidEntity) {
        state = handleAction(
          state,
          actions.addEntity({
            entity: createEntityFromTemplate("LASER", {
              position: nextPos,
              glyph: getLaserGlyph(beam, beam.power, false, weapon.type),
            }),
          }),
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
          lastPos: nextPos,
        });
        beams.push({
          power: beam.power - 1,
          dx: splitter.type === "horizontal" ? -1 : 0,
          dy: splitter.type === "vertical" ? -1 : 0,
          lastPos: nextPos,
        });
        beam.power = 0;
      } else if (solidEntity.reflector) {
        const newDirection = reflect(beam, solidEntity.reflector.type);
        beam.dx = newDirection.dx;
        beam.dy = newDirection.dy;
      } else if (solidEntity.destructible && weapon.type !== "ELECTRIC") {
        state = handleAction(
          state,
          actions.addEntity({
            entity: createEntityFromTemplate("LASER", {
              position: nextPos,
              glyph: getLaserGlyph(beam, beam.power, true, weapon.type),
            }),
          }),
        );
        if (weapon.type === "EXPLOSIVE") {
          explosionCenters.push(nextPos);
        }
        beam.power--;
      } else if (weapon.type === "ELECTRIC" && solidEntity.conductive) {
        spreadElectricity.push(solidEntity);
        beam.power--;
      } else {
        beam.power = 0;
        if (weapon.type === "EXPLOSIVE") {
          explosionCenters.push(beam.lastPos);
        }
      }
      beam.lastPos = nextPos;
    }
  }

  for (let pos of explosionCenters) {
    for (let adjacentPos of getAdjacentPositions(pos)) {
      const entities = selectors.entitiesAtPosition(state, adjacentPos);
      if (entities.every(e => !e.targeting)) {
        state = handleAction(
          state,
          actions.addEntity({
            entity: createEntityFromTemplate("LASER", {
              position: adjacentPos,
              glyph: getLaserGlyph({ dx: 1, dy: 1 }, 1, true, weapon.type),
            }),
          }),
        );
      }
    }
  }

  while (spreadElectricity.length) {
    const from = spreadElectricity.pop() as Entity;
    const pos = from.position as Position;
    const entitiesAtPos = selectors.entitiesAtPosition(state, pos);
    if (from.conductive && entitiesAtPos.every(e => !e.targeting)) {
      const newEntity = createEntityFromTemplate("LASER", {
        position: pos,
        glyph: getLaserGlyph({ dx: 1, dy: 1 }, 1, true, weapon.type),
      });
      state = handleAction(
        state,
        actions.addEntity({
          entity: newEntity,
        }),
      );
      for (let adjacentPos of getAdjacentPositions(pos)) {
        for (let to of selectors.entitiesAtPosition(state, adjacentPos)) {
          spreadElectricity.push(to);
        }
      }
    }
  }

  return state;
}

function fireWeapon(state: GameState, action: Action) {
  const activeWeapon = selectors.activeWeapon(state);
  const player = selectors.player(state);
  if (!player || !player.position || !activeWeapon || !activeWeapon.weapon)
    return state;

  const targetingLasers = selectors.targetingLasers(state);

  const entitiesToSwap = [player];
  const entitiesToRemove: string[] = [];
  for (const laser of targetingLasers) {
    const { position } = laser;
    if (position) {
      const entitiesAtPos = selectors.entitiesAtPosition(state, position);
      for (let entity of entitiesAtPos) {
        if (entity.destructible && activeWeapon.weapon.type === "TELEPORT") {
          entitiesToSwap.push(entity);
        } else if (
          entity.conductive &&
          activeWeapon.weapon.type === "ELECTRIC"
        ) {
          entitiesToRemove.push(entity.id);
        } else if (entity.destructible) {
          entitiesToRemove.push(entity.id);
        }
      }
    }
    state = handleAction(state, actions.removeEntity({ entityId: laser.id }));
  }

  for (let id of [...new Set(entitiesToRemove)]) {
    state = handleAction(state, actions.attack({ target: id }));
  }

  if (entitiesToSwap.length > 1) {
    const positions = entitiesToSwap.map(e => e.position);
    entitiesToSwap.forEach((entity, index) => {
      state = handleAction(
        state,
        actions.addEntity({
          entity: {
            ...entity,
            position: positions[(index + 1) % positions.length],
          },
        }),
      );
    });
  }

  state = handleAction(
    state,
    actions.addEntity({
      entity: {
        ...activeWeapon,
        weapon: {
          ...activeWeapon.weapon,
          readyIn: activeWeapon.weapon.cooldown + 1,
          active: false,
        },
      },
    }),
  );

  state = handleAction(state, actions.playerTookTurn());
  return state;
}

function activateThrow(state: GameState, action: Action): GameState {
  if (!isActionOf(actions.activateThrow, action)) return state;
  const player = selectors.player(state);
  if (!player || !player.position || !player.inventory) return state;
  if (action.payload.entity.reflector && !player.inventory.reflectors) {
    return state;
  }
  if (action.payload.entity.splitter && !player.inventory.splitters) {
    return state;
  }

  const fovPositions = computeThrowFOV(state, player.position, THROWING_RANGE);
  for (let pos of fovPositions) {
    state = handleAction(
      state,
      actions.addEntity({
        entity: createEntityFromTemplate("FOV_MARKER", { position: pos }),
      }),
    );
  }

  const { entity } = action.payload;
  entity.throwing = { range: THROWING_RANGE };
  state = handleAction(state, actions.addEntity({ entity }));
  return state;
}

function rotateThrow(state: GameState, action: Action): GameState {
  let entity = selectors.throwingTarget(state);
  if (!entity) return state;
  if (entity.reflector && entity.glyph) {
    entity = {
      ...entity,
      reflector: { type: entity.reflector.type === "\\" ? "/" : "\\" },
      glyph: {
        ...entity.glyph,
        glyph: entity.glyph.glyph === "\\" ? "/" : "\\",
      },
    };
  }
  if (entity.splitter && entity.glyph) {
    entity = {
      ...entity,
      splitter: {
        type: entity.splitter.type === "horizontal" ? "vertical" : "horizontal",
      },
      glyph: { ...entity.glyph, glyph: entity.glyph.glyph === "⬍" ? "⬌" : "⬍" },
    };
  }
  state = handleAction(state, actions.addEntity({ entity }));
  return state;
}

function cancelThrow(state: GameState, action: Action): GameState {
  for (let entity of selectors.entityList(state).filter(e => e.fov)) {
    state = handleAction(state, actions.removeEntity({ entityId: entity.id }));
  }
  const entity = selectors.throwingTarget(state);
  if (!entity) return state;
  state = handleAction(state, actions.removeEntity({ entityId: entity.id }));
  return state;
}

function executeThrow(state: GameState, action: Action): GameState {
  for (let entity of selectors.entityList(state).filter(e => e.fov)) {
    state = handleAction(state, actions.removeEntity({ entityId: entity.id }));
  }
  const entity = selectors.throwingTarget(state);
  if (!entity || !entity.position || !entity.throwing) return state;

  const player = selectors.player(state);
  if (!player || !player.position || !player.inventory) return state;

  const { inventory } = player;
  if (entity.reflector && !inventory.reflectors) return state;
  if (entity.splitter && !inventory.splitters) return state;

  const { position } = entity;
  const distance = getDistance(position, player.position);
  if (distance > entity.throwing.range) return state;

  const entitiesAtPosition = selectors.entitiesAtPosition(state, position);
  if (entitiesAtPosition.some(e => e.id !== entity.id && !!e.blocking))
    return state;

  state = handleAction(
    state,
    actions.addEntity({
      entity: {
        ...entity,
        throwing: undefined,
      },
    }),
  );

  state = handleAction(
    state,
    actions.addEntity({
      entity: {
        ...player,
        inventory: {
          splitters: entity.splitter
            ? inventory.splitters - 1
            : inventory.splitters,
          reflectors: entity.reflector
            ? inventory.reflectors - 1
            : inventory.reflectors,
        },
      },
    }),
  );
  return state;
}

function move(state: GameState, action: Action): GameState {
  if (!isActionOf(actions.move, action)) return state;
  const entity = selectors.entity(state, action.payload.entityId);
  const { position } = entity;
  if (!position) {
    return state;
  }
  const newPosition = {
    x: position.x + action.payload.dx,
    y: position.y + action.payload.dy,
  };
  const entitiesAtNewPosition = selectors.entitiesAtPosition(
    state,
    newPosition,
  );
  if (
    entity.blocking &&
    !entity.throwing &&
    entitiesAtNewPosition.some(
      other => !!(other.blocking && !(entity.id === PLAYER_ID && other.pickup)),
    )
  ) {
    return state;
  }
  state = handleAction(
    state,
    actions.addEntity({
      entity: {
        ...entity,
        position: newPosition,
      },
    }),
  );
  if (entity.id === PLAYER_ID) {
    state = handleAction(state, actions.playerTookTurn());
  }
  return state;
}

export function attack(state: GameState, action: Action): GameState {
  if (!isActionOf(actions.attack, action)) return state;
  const target = selectors.entity(state, action.payload.target);
  if (target.hitPoints) {
    state = handleAction(
      state,
      actions.addEntity({
        entity: {
          ...target,
          hitPoints: {
            ...target.hitPoints,
            current: target.hitPoints.current - 1,
          },
        },
      }),
    );
  }
  if (target.destructible) {
    state = handleAction(state, actions.removeEntity({ entityId: target.id }));
  }
  if (target.id === PLAYER_ID) {
    state = {
      ...state,
      messageLog: [...state.messageLog, "You receive one damage"],
    };
  }
  return state;
}

function activateWeapon(state: GameState, action: Action): GameState {
  if (!isActionOf(actions.activateWeapon, action)) return state;

  const weaponInSlot = selectors.weaponInSlot(state, action.payload.slot);
  if (!weaponInSlot) return state;

  for (let weapon of selectors.weapons(state)) {
    if (weapon !== weaponInSlot && weapon.weapon && weapon.weapon.active) {
      state = handleAction(
        state,
        actions.addEntity({
          entity: {
            ...weapon,
            weapon: {
              ...weapon.weapon,
              active: false,
            },
          },
        }),
      );
    }
  }

  const entity = weaponInSlot;
  const { weapon } = entity;
  if (!weapon) return state;
  state = {
    ...state,
    entities: {
      ...state.entities,
      [entity.id]: {
        ...entity,
        weapon: {
          ...weapon,
          active: !weapon.active && !weapon.readyIn,
        },
      },
    },
  };
  state = handleAction(state, actions.targetWeapon(RIGHT));
  return state;
}

function addEntity(state: GameState, action: Action): GameState {
  if (!isActionOf(actions.addEntity, action)) return state;
  const { entity } = action.payload;
  const prev = selectors.entity(state, action.payload.entity.id);
  let { entitiesByPosition } = state;
  if (prev && prev.position) {
    const key = getPosKey(prev.position);
    entitiesByPosition = {
      ...entitiesByPosition,
      [key]: entitiesByPosition[key].filter(id => id !== prev.id),
    };
  }
  if (entity.position) {
    const key = getPosKey(entity.position);
    entitiesByPosition = {
      ...entitiesByPosition,
      [key]: [...(entitiesByPosition[key] || []), entity.id],
    };
  }
  state = {
    ...state,
    entitiesByPosition,
    entities: {
      ...state.entities,
      [entity.id]: entity,
    },
  };
  return state;
}

function removeEntity(state: GameState, action: Action): GameState {
  if (!isActionOf(actions.removeEntity, action)) return state;
  const prev = selectors.entity(state, action.payload.entityId);
  if (!prev) {
    console.warn(
      `tried to remove nonexistant entity ${action.payload.entityId}`,
    );
    return state;
  }
  let { entitiesByPosition } = state;
  if (prev.position) {
    const key = getPosKey(prev.position);
    entitiesByPosition = {
      ...entitiesByPosition,
      [key]: entitiesByPosition[key].filter(id => id !== prev.id),
    };
  }
  return {
    ...state,
    entitiesByPosition,
    entities: selectors
      .entityList(state)
      .filter(entity => entity.id !== prev.id)
      .reduce((acc, cur) => ({ ...acc, [cur.id]: cur }), {}),
  };
}

function activateEquip(state: GameState, action: Action) {
  if (!isActionOf(actions.activateEquip, action)) return state;
  state = handleAction(
    state,
    actions.addEntity({
      entity: {
        ...action.payload.entity,
        equipping: {},
      },
    }),
  );

  if (!selectors.weaponInSlot(state, 1)) {
    state = executeEquip(state, actions.executeEquip({ slot: 1 }));
  } else if (!selectors.weaponInSlot(state, 2)) {
    state = executeEquip(state, actions.executeEquip({ slot: 2 }));
  } else if (!selectors.weaponInSlot(state, 3)) {
    state = executeEquip(state, actions.executeEquip({ slot: 3 }));
  } else if (!selectors.weaponInSlot(state, 4)) {
    state = executeEquip(state, actions.executeEquip({ slot: 4 }));
  } else {
    state = {
      ...state,
      messageLog: [
        ...state.messageLog,
        "Equipping weapon... Please select slot.",
      ],
    };
  }

  return state;
}

function executeEquip(state: GameState, action: Action) {
  if (!isActionOf(actions.executeEquip, action)) return state;
  const equipping = selectors.entityList(state).filter(e => e.equipping)[0];
  if (!equipping || !equipping.equipping || !equipping.weapon) return state;

  const { slot } = action.payload;
  if (slot) {
    const weaponInSlot = selectors.weaponInSlot(state, slot);
    if (weaponInSlot) {
      state = handleAction(
        state,
        actions.removeEntity({ entityId: weaponInSlot.id }),
      );
    }
    state = handleAction(
      state,
      actions.addEntity({
        entity: {
          ...equipping,
          equipping: undefined,
          position: undefined,
          weapon: {
            ...equipping.weapon,
            slot,
          },
        },
      }),
    );
    state = {
      ...state,
      messageLog: [...state.messageLog, `Equipped to slot ${slot}.`],
    };
  } else {
    state = {
      ...state,
      messageLog: [...state.messageLog, "Discarded."],
    };
  }
  return state;
}

const actionHandlers: {
  [actionType: string]: (state: GameState, action: Action) => GameState;
} = {
  [getType(actions.fireWeapon)]: fireWeapon,
  [getType(actions.playerTookTurn)]: processTurns,
  [getType(actions.init)]: init,
  [getType(actions.activateWeapon)]: activateWeapon,
  [getType(actions.targetWeapon)]: targetWeapon,
  [getType(actions.activateThrow)]: activateThrow,
  [getType(actions.rotateThrow)]: rotateThrow,
  [getType(actions.cancelThrow)]: cancelThrow,
  [getType(actions.executeThrow)]: executeThrow,
  [getType(actions.move)]: move,
  [getType(actions.attack)]: attack,
  [getType(actions.addEntity)]: addEntity,
  [getType(actions.removeEntity)]: removeEntity,
  [getType(actions.activateEquip)]: activateEquip,
  [getType(actions.executeEquip)]: executeEquip,
};

export default function handleAction(
  state: GameState,
  action: Action,
): GameState {
  if (actionHandlers[action.type]) {
    // console.debug("handling action", { action, state });
    return actionHandlers[action.type](state, action);
  } else if (!action.type.startsWith("@@")) {
    console.warn("unhandled action", { action, state });
  }
  return state;
}
