import actions from "~/state/actions";
import { Entity, Pos } from "~/types";
import { getAdjacentPositions } from "~/utils/geometry";
import { createLaser, getSplitTemplateName, reflect } from "~/utils/lasers";
import { registerHandler } from "~state/handleAction";
import WrappedState from "~types/WrappedState";
import { createEntityFromTemplate } from "~utils/entities";

function targetWeapon(
  state: WrappedState,
  action: ReturnType<typeof actions.targetWeapon>,
): void {
  state.setRaw({
    ...state.raw,
    lastAimingDirection: action.payload,
  });
  const targetingLasers = state.select.entitiesWithComps("targeting", "pos");
  state.act.removeEntities({
    entityIds: targetingLasers.map(e => e.id),
  });

  const player = state.select.player();
  if (!player) return;
  const playerPosition = player.pos;

  const activeWeapon = state.select.activeWeapon();
  if (!activeWeapon) return;

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
      const entitiesAtPos = state.select.entitiesAtPosition(nextPos);
      const solidEntity = entitiesAtPos.find(
        entity => entity.blocking && entity.blocking.lasers,
      );
      const reflectorEntity = entitiesAtPos.find(entity => entity.reflector);
      const splitterEntity = entitiesAtPos.find(entity => entity.splitter);

      if (!solidEntity && !reflectorEntity) {
        state.act.addEntity({
          entity: createLaser(beam, beam.power, false, weapon.type, nextPos),
        });
      } else if (
        splitterEntity &&
        splitterEntity.splitter &&
        ((splitterEntity.splitter.type === "horizontal" && beam.dy) ||
          (splitterEntity.splitter.type === "vertical" && beam.dx))
      ) {
        const { splitter } = splitterEntity;
        const cosmeticTemplate = getSplitTemplateName(beam.power, beam);
        state.act.addEntity({
          entity: createEntityFromTemplate(cosmeticTemplate, {
            pos: nextPos,
          }),
        });
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
        const { direction: newDirection, cosmeticTemplate } = reflect(
          beam,
          reflectorEntity.reflector.type,
          beam.power,
        );
        state.act.addEntity({
          entity: createEntityFromTemplate(cosmeticTemplate, {
            pos: nextPos,
          }),
        });
        beam.dx = newDirection.dx;
        beam.dy = newDirection.dy;
      } else if (
        solidEntity &&
        solidEntity.destructible &&
        weapon.type !== "ELECTRIC"
      ) {
        state.act.addEntity({
          entity: createLaser(beam, beam.power, true, weapon.type, nextPos),
        });
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
      const entities = state.select.entitiesAtPosition(adjacentPos);
      if (entities.every(e => !e.targeting)) {
        state.act.addEntity({
          entity: createLaser(
            { dx: 1, dy: 1 },
            1,
            true,
            weapon.type,
            adjacentPos,
          ),
        });
      }
    }
  }

  while (spreadElectricity.length) {
    const from = spreadElectricity.pop() as Entity;
    const pos = from.pos as Pos;
    const entitiesAtPos = state.select.entitiesAtPosition(pos);
    if (from.conductive && entitiesAtPos.every(e => !e.targeting)) {
      const newEntity = createLaser(
        { dx: 1, dy: 1 },
        1,
        true,
        weapon.type,
        pos,
      );
      state.act.addEntity({
        entity: newEntity,
      });
      for (const adjacentPos of getAdjacentPositions(pos)) {
        for (const to of state.select.entitiesAtPosition(adjacentPos)) {
          spreadElectricity.push(to);
        }
      }
    }
  }
}

registerHandler(targetWeapon, actions.targetWeapon);
