import { createAction } from "typesafe-actions";
import {
  BASE_LASER_STRENGTH,
  DOWN,
  LEFT,
  PLAYER_ID,
  RIGHT,
  UP,
} from "../../constants";
import audio from "../../lib/audio";
import { areConditionsMet } from "../../lib/conditions";
import { createEntityFromTemplate } from "../../lib/entities";
import { areDirectionsEqual, getConstDir } from "../../lib/geometry";
import { createLaser, getSplitTemplateName, reflect } from "../../lib/lasers";
import { Direction, Pos } from "../../types";
import WrappedState from "../../types/WrappedState";
import { registerHandler } from "../handleAction";

const targetWeapon = createAction("TARGET_WEAPON")<{
  direction: Direction;
  source: string;
}>();
export default targetWeapon;

function targetWeaponHandler(
  state: WrappedState,
  action: ReturnType<typeof targetWeapon>
): void {
  const { direction, source } = action.payload;
  const sourceEntity = state.select.entityById(source);
  if (!sourceEntity || !sourceEntity.pos) return;
  const sourcePos = sourceEntity.pos;
  const isPlayer = source === PLAYER_ID;

  if (isPlayer) {
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
      lastAimingDirection: direction,
    });
  }

  const lasers = state.select
    .entitiesWithComps("laser", "pos")
    .filter((e) => e.laser.source === source);
  if (lasers.length === 0) {
    audio.loop("laser_active", { volume: 0.5 });
  }
  if (lasers.filter((e) => e.laser.source === source).length === 0) {
    audio.play("laser_activate");
  }
  state.act.removeEntities(lasers.map((e) => e.id));

  if (isPlayer) {
    if (getConstDir(direction) === UP) {
      state.act.addEntity(
        createEntityFromTemplate("LASER_PLAYER_UP", { pos: sourcePos })
      );
    } else if (getConstDir(direction) === DOWN) {
      state.act.addEntity(
        createEntityFromTemplate("LASER_PLAYER_DOWN", { pos: sourcePos })
      );
    } else if (getConstDir(direction) === LEFT) {
      state.act.addEntity(
        createEntityFromTemplate("LASER_PLAYER_LEFT", { pos: sourcePos })
      );
    } else if (getConstDir(direction) === RIGHT) {
      state.act.addEntity(
        createEntityFromTemplate("LASER_PLAYER_RIGHT", { pos: sourcePos })
      );
    }
  }

  const beams = [
    {
      strength: BASE_LASER_STRENGTH,
      dx: direction.dx,
      dy: direction.dy,
      lastPos: sourcePos,
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
        (entity) => entity.blocking && entity.blocking.lasers
      );
      const reflectorEntity = entitiesAtPos.find((entity) => entity.reflector);
      const splitterEntity = entitiesAtPos.find((entity) => entity.splitter);
      const absorberEntity = entitiesAtPos.find((entity) => entity.absorber);

      if (
        entitiesAtPos.some(
          (e) =>
            e.laser &&
            e.laser.strength >= beam.strength &&
            e.laser.source === source &&
            areDirectionsEqual(beam, e.laser.direction)
        )
      ) {
        // if there's already a laser in the same direction from the same source, set beam to zero to avoid infinite loops
        beam.strength = 0;
      } else if (!solidEntity && !reflectorEntity) {
        state.act.addEntity(
          createLaser(beam, beam.strength, false, nextPos, source)
        );
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
          splitter.type
        );
        let cosmeticEntity = createEntityFromTemplate(cosmeticTemplate, {
          pos: nextPos,
        });
        cosmeticEntity = {
          ...cosmeticEntity,
          laser: cosmeticEntity.laser
            ? { ...cosmeticEntity.laser, source }
            : undefined,
        };
        state.act.addEntity(cosmeticEntity);
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
          beam.strength
        );
        let cosmeticEntity = createEntityFromTemplate(cosmeticTemplate, {
          pos: nextPos,
        });
        cosmeticEntity = {
          ...cosmeticEntity,
          laser: cosmeticEntity.laser
            ? { ...cosmeticEntity.laser, source }
            : undefined,
        };
        state.act.addEntity(cosmeticEntity);
        beam.dx = newDirection.dx;
        beam.dy = newDirection.dy;
      } else if (solidEntity && solidEntity.destructible) {
        let laserEntity = createLaser(
          beam,
          beam.strength,
          true,
          nextPos,
          source
        );
        if (absorberEntity && laserEntity.display) {
          laserEntity = {
            ...laserEntity,
            display: {
              ...laserEntity.display,
              tile: "absorber_charge",
            },
          };
        }
        state.act.addEntity(laserEntity);
        beam.strength--;
        if (solidEntity.stopsLaser) {
          beam.strength = 0;
        }
      } else {
        beam.strength = 0;
      }
      beam.lastPos = nextPos;
    }
  }
}

registerHandler(targetWeaponHandler, targetWeapon);
