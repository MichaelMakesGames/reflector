import * as actions from "../actions";
import { PLAYER_ID } from "../constants";
import * as selectors from "../selectors";
import { createEntityFromTemplate } from "../templates";
import { Entity, GameState, Position } from "../types";
import { getAdjacentPositions, getLaserGlyph, reflect } from "../utils";
import { addEntity } from "./addEntity";
import { removeEntities } from "./removeEntities";

export function targetWeapon(
  state: GameState,
  action: ReturnType<typeof actions.targetWeapon>,
): GameState {
  const targetingLasers = selectors.targetingLasers(state);
  state = removeEntities(
    state,
    actions.removeEntities({
      entityIds: targetingLasers.map(e => e.id),
    }),
  );

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
        state = addEntity(
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
        state = addEntity(
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
        state = addEntity(
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
      state = addEntity(
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
