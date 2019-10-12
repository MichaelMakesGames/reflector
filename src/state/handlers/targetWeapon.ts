import * as actions from "~/state/actions";
import { PLAYER_ID } from "~/constants";
import * as selectors from "~/state/selectors";
import { getAdjacentPositions } from "~/utils/geometry";
import { createLaser, reflect } from "~/utils/lasers";
import { Entity, GameState, Pos } from "~/types";
import handleAction, { registerHandler } from "~state/handleAction";

function targetWeapon(
  state: GameState,
  action: ReturnType<typeof actions.targetWeapon>,
): GameState {
  let newState = state;
  const targetingLasers = selectors.targetingLasers(newState);
  newState = handleAction(
    newState,
    actions.removeEntities({
      entityIds: targetingLasers.map(e => e.id),
    }),
  );

  const player = selectors.entityById(newState, PLAYER_ID);
  const playerPosition = player.pos;
  if (!playerPosition) return newState;

  const activeWeapon = selectors.activeWeapon(newState);
  if (!activeWeapon) return newState;
  const { weapon } = activeWeapon;

  const beams = [
    {
      power: weapon.power,
      dx: action.payload.dx,
      dy: action.payload.dy,
      lastPos: playerPosition,
    },
  ];

  const explosionCenters: Pos[] = [];
  const spreadElectricity: Entity[] = [];

  while (beams.length) {
    const beam = beams[beams.length - 1];
    beams.pop();
    while (beam.power) {
      const nextPos: Pos = {
        x: beam.lastPos.x + beam.dx,
        y: beam.lastPos.y + beam.dy,
      };
      const entitiesAtPos = selectors.entitiesAtPosition(newState, nextPos);
      const solidEntity = entitiesAtPos.find(
        entity => entity.blocking && entity.blocking.lasers,
      );
      const reflectorEntity = entitiesAtPos.find(entity => entity.reflector);
      const splitterEntity = entitiesAtPos.find(entity => entity.splitter);

      if (!solidEntity && !reflectorEntity) {
        newState = handleAction(
          newState,
          actions.addEntity({
            entity: createLaser(beam, beam.power, false, weapon.type, nextPos),
          }),
        );
      } else if (
        splitterEntity &&
        splitterEntity.splitter &&
        ((splitterEntity.splitter.type === "horizontal" && beam.dy) ||
          (splitterEntity.splitter.type === "vertical" && beam.dx))
      ) {
        const { splitter } = splitterEntity;
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
      } else if (reflectorEntity && reflectorEntity.reflector) {
        const newDirection = reflect(beam, reflectorEntity.reflector.type);
        beam.dx = newDirection.dx;
        beam.dy = newDirection.dy;
      } else if (
        solidEntity &&
        solidEntity.destructible &&
        weapon.type !== "ELECTRIC"
      ) {
        newState = handleAction(
          newState,
          actions.addEntity({
            entity: createLaser(beam, beam.power, true, weapon.type, nextPos),
          }),
        );
        if (weapon.type === "EXPLOSIVE") {
          explosionCenters.push(nextPos);
        }
        beam.power--;
      } else if (
        weapon.type === "ELECTRIC" &&
        solidEntity &&
        solidEntity.conductive
      ) {
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

  for (const pos of explosionCenters) {
    for (const adjacentPos of getAdjacentPositions(pos)) {
      const entities = selectors.entitiesAtPosition(newState, adjacentPos);
      if (entities.every(e => !e.targeting)) {
        newState = handleAction(
          newState,
          actions.addEntity({
            entity: createLaser(
              { dx: 1, dy: 1 },
              1,
              true,
              weapon.type,
              adjacentPos,
            ),
          }),
        );
      }
    }
  }

  while (spreadElectricity.length) {
    const from = spreadElectricity.pop() as Entity;
    const pos = from.pos as Pos;
    const entitiesAtPos = selectors.entitiesAtPosition(newState, pos);
    if (from.conductive && entitiesAtPos.every(e => !e.targeting)) {
      const newEntity = createLaser(
        { dx: 1, dy: 1 },
        1,
        true,
        weapon.type,
        pos,
      );
      newState = handleAction(
        newState,
        actions.addEntity({
          entity: newEntity,
        }),
      );
      for (const adjacentPos of getAdjacentPositions(pos)) {
        for (const to of selectors.entitiesAtPosition(newState, adjacentPos)) {
          spreadElectricity.push(to);
        }
      }
    }
  }

  return newState;
}

registerHandler(targetWeapon, actions.targetWeapon);
