import { createStandardAction } from "typesafe-actions";
import { Pos, Direction } from "~/types";
import { createLaser, getSplitTemplateName, reflect } from "~lib/lasers";
import { BASE_LASER_STRENGTH, DOWN, LEFT, RIGHT, UP } from "~constants";
import { registerHandler } from "~state/handleAction";
import WrappedState from "~types/WrappedState";
import { areConditionsMet } from "~lib/conditions";
import { createEntityFromTemplate } from "~lib/entities";
import { areDirectionsEqual, getConstDir } from "~lib/geometry";

const targetWeapon = createStandardAction("TARGET_WEAPON")<Direction>();
export default targetWeapon;

function targetWeaponHandler(
  state: WrappedState,
  action: ReturnType<typeof targetWeapon>,
): void {
  if (state.select.laserState() === "RECHARGING") {
    state.act.logMessage({
      message:
        "Your laser needs to recharge. It will be ready again next turn.",
    });
    return;
  }
  state.act.setAutoMovePath([]);
  state.setRaw({
    ...state.raw,
    laserState: "ACTIVE",
    lastAimingDirection: action.payload,
  });
  const lasers = state.select.entitiesWithComps("laser", "pos");
  state.act.removeEntities(lasers.map((e) => e.id));

  const player = state.select.player();
  if (!player) return;
  const playerPosition = player.pos;

  if (getConstDir(action.payload) === UP) {
    state.act.addEntity(
      createEntityFromTemplate("LASER_PLAYER_UP", { pos: playerPosition }),
    );
  } else if (getConstDir(action.payload) === DOWN) {
    state.act.addEntity(
      createEntityFromTemplate("LASER_PLAYER_DOWN", { pos: playerPosition }),
    );
  } else if (getConstDir(action.payload) === LEFT) {
    state.act.addEntity(
      createEntityFromTemplate("LASER_PLAYER_LEFT", { pos: playerPosition }),
    );
  } else if (getConstDir(action.payload) === RIGHT) {
    state.act.addEntity(
      createEntityFromTemplate("LASER_PLAYER_RIGHT", { pos: playerPosition }),
    );
  }

  const beams = [
    {
      strength: BASE_LASER_STRENGTH,
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
        (entity) => entity.blocking && entity.blocking.lasers,
      );
      const reflectorEntity = entitiesAtPos.find((entity) => entity.reflector);
      const splitterEntity = entitiesAtPos.find((entity) => entity.splitter);

      if (
        entitiesAtPos.some(
          (e) =>
            e.laser &&
            e.laser.strength >= beam.strength &&
            areDirectionsEqual(beam, e.laser.direction),
        )
      ) {
        // if there's already a laser in the same direction, set beam to zero to avoid infinite loops
        beam.strength = 0;
      } else if (!solidEntity && !reflectorEntity) {
        state.act.addEntity(createLaser(beam, beam.strength, false, nextPos));
      } else if (
        splitterEntity &&
        splitterEntity.splitter &&
        areConditionsMet(state, splitterEntity, "isPowered") &&
        ((splitterEntity.splitter.type === "horizontal" && beam.dy) ||
          (splitterEntity.splitter.type === "vertical" && beam.dx) ||
          splitterEntity.splitter.type === "advanced")
      ) {
        const { splitter } = splitterEntity;
        const cosmeticTemplate = getSplitTemplateName(
          beam.strength,
          beam,
          splitter.type,
        );
        state.act.addEntity(
          createEntityFromTemplate(cosmeticTemplate, {
            pos: nextPos,
          }),
        );
        if (splitter.type === "advanced") {
          const oppositeDir = getConstDir({
            dx: beam.dx * -1,
            dy: beam.dy * -1,
          });
          for (const dir of [UP, DOWN, LEFT, RIGHT]) {
            if (dir !== oppositeDir) {
              beams.push({
                strength: beam.strength - 1,
                lastPos: nextPos,
                ...dir,
              });
            }
          }
        } else {
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
        }
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

registerHandler(targetWeaponHandler, targetWeapon);
