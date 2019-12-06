import actions from "~/state/actions";
import { Pos } from "~/types";
import { createLaser, getSplitTemplateName, reflect } from "~/utils/lasers";
import { registerHandler } from "~state/handleAction";
import WrappedState from "~types/WrappedState";
import { createEntityFromTemplate } from "~utils/entities";
import { BASE_LASER_POWER } from "~constants";

function targetWeapon(
  state: WrappedState,
  action: ReturnType<typeof actions.targetWeapon>,
): void {
  state.setRaw({
    ...state.raw,
    lastAimingDirection: action.payload,
  });
  const lasers = state.select.entitiesWithComps("laser", "pos");
  state.act.removeEntities(lasers.map(e => e.id));

  const player = state.select.player();
  if (!player) return;
  const playerPosition = player.pos;

  const beams = [
    {
      power: BASE_LASER_POWER,
      dx: action.payload.dx,
      dy: action.payload.dy,
      lastPos: playerPosition,
    },
  ];

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
        state.act.addEntity(createLaser(beam, beam.power, false, nextPos));
      } else if (
        splitterEntity &&
        splitterEntity.splitter &&
        ((splitterEntity.splitter.type === "horizontal" && beam.dy) ||
          (splitterEntity.splitter.type === "vertical" && beam.dx))
      ) {
        const { splitter } = splitterEntity;
        const cosmeticTemplate = getSplitTemplateName(beam.power, beam);
        state.act.addEntity(
          createEntityFromTemplate(cosmeticTemplate, {
            pos: nextPos,
          }),
        );
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
        state.act.addEntity(
          createEntityFromTemplate(cosmeticTemplate, {
            pos: nextPos,
          }),
        );
        beam.dx = newDirection.dx;
        beam.dy = newDirection.dy;
      } else if (solidEntity && solidEntity.destructible) {
        state.act.addEntity(createLaser(beam, beam.power, true, nextPos));
        beam.power--;
      } else {
        beam.power = 0;
      }
      beam.lastPos = nextPos;
    }
  }
}

registerHandler(targetWeapon, actions.targetWeapon);
