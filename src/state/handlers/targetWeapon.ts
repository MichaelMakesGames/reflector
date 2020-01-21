import actions from "~/state/actions";
import { Pos } from "~/types";
import { createLaser, getSplitTemplateName, reflect } from "~/utils/lasers";
import { registerHandler } from "~state/handleAction";
import WrappedState from "~types/WrappedState";
import { createEntityFromTemplate } from "~utils/entities";
import { BASE_LASER_STRENGTH, UNPOWERED_LASER_STRENGTH } from "~constants";
import { getConstDir } from "~utils/geometry";

function targetWeapon(
  state: WrappedState,
  action: ReturnType<typeof actions.targetWeapon>,
): void {
  if (
    !state.select.canAffordToPay("POWER", 1) &&
    getConstDir(state.select.lastAimingDirection()) ===
      getConstDir(action.payload)
  ) {
    state.act.logMessage({
      message:
        "You are out of power! Your laser cannot be split and cannot shoot through enemies.",
    });
  }
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
      strength: state.select.canAffordToPay("POWER", 1)
        ? BASE_LASER_STRENGTH
        : UNPOWERED_LASER_STRENGTH,
      dx: action.payload.dx,
      dy: action.payload.dy,
      lastPos: playerPosition,
    },
  ];

  while (beams.length) {
    const beam = beams[beams.length - 1];
    beams.pop();
    while (beam.strength) {
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

      if (
        entitiesAtPos.some(
          e =>
            e.laser &&
            e.laser.strength >= beam.strength &&
            getConstDir(beam) === getConstDir(e.laser.direction),
        )
      ) {
        beam.strength = 0;
      } else if (!solidEntity && !reflectorEntity) {
        state.act.addEntity(createLaser(beam, beam.strength, false, nextPos));
      } else if (
        splitterEntity &&
        splitterEntity.splitter &&
        ((splitterEntity.splitter.type === "horizontal" && beam.dy) ||
          (splitterEntity.splitter.type === "vertical" && beam.dx))
      ) {
        const { splitter } = splitterEntity;
        const cosmeticTemplate = getSplitTemplateName(beam.strength, beam);
        state.act.addEntity(
          createEntityFromTemplate(cosmeticTemplate, {
            pos: nextPos,
          }),
        );
        beams.push({
          strength: beam.strength - 1,
          dx: splitter.type === "horizontal" ? 1 : 0,
          dy: splitter.type === "vertical" ? 1 : 0,
          lastPos: nextPos,
        });
        beams.push({
          strength: beam.strength - 1,
          dx: splitter.type === "horizontal" ? -1 : 0,
          dy: splitter.type === "vertical" ? -1 : 0,
          lastPos: nextPos,
        });
        beam.strength = 0;
      } else if (reflectorEntity && reflectorEntity.reflector) {
        const { direction: newDirection, cosmeticTemplate } = reflect(
          beam,
          reflectorEntity.reflector.type,
          beam.strength,
        );
        state.act.addEntity(
          createEntityFromTemplate(cosmeticTemplate, {
            pos: nextPos,
          }),
        );
        beam.dx = newDirection.dx;
        beam.dy = newDirection.dy;
      } else if (solidEntity && solidEntity.destructible) {
        state.act.addEntity(createLaser(beam, beam.strength, true, nextPos));
        beam.strength--;
      } else {
        beam.strength = 0;
      }
      beam.lastPos = nextPos;
    }
  }
}

registerHandler(targetWeapon, actions.targetWeapon);
