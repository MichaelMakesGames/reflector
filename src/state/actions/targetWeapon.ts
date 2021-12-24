import { createAction } from "typesafe-actions";
import {
  BASE_LASER_STRENGTH,
  DOWN,
  LEFT,
  PLAYER_ID,
  RIGHT,
  UP,
} from "../../constants";
import { areConditionsMet } from "../../lib/conditions";
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
  const turn = state.select.turn();

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
    state.audio.loop("laser_active", { volume: 0.5 });
  }
  if (lasers.filter((e) => e.laser.source === source).length === 0) {
    state.audio.play("laser_activate");
  }
  state.act.removeEntities(lasers.map((e) => e.id));

  if (isPlayer) {
    if (getConstDir(direction) === UP) {
      const playerLaser = createLaser(
        direction,
        1,
        false,
        sourcePos,
        source,
        turn,
        "LASER_PLAYER_UP"
      );
      state.act.addEntity(playerLaser);
    } else if (getConstDir(direction) === DOWN) {
      const playerLaser = createLaser(
        direction,
        1,
        false,
        sourcePos,
        source,
        turn,
        "LASER_PLAYER_DOWN"
      );
      state.act.addEntity(playerLaser);
    } else if (getConstDir(direction) === LEFT) {
      const playerLaser = createLaser(
        direction,
        1,
        false,
        sourcePos,
        source,
        turn,
        "LASER_PLAYER_LEFT"
      );
      state.act.addEntity(playerLaser);
    } else if (getConstDir(direction) === RIGHT) {
      const playerLaser = createLaser(
        direction,
        1,
        false,
        sourcePos,
        source,
        turn,
        "LASER_PLAYER_RIGHT"
      );
      state.act.addEntity(playerLaser);
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
      const entitiesAtLastPos = state.select.entitiesAtPosition(beam.lastPos);
      const entitiesAtNextPos = state.select.entitiesAtPosition(nextPos);
      const solidEntity = entitiesAtNextPos.find(
        (entity) => entity.blocking && entity.blocking.lasers
      );
      const reflectorEntity = entitiesAtNextPos.find(
        (entity) => entity.reflector
      );
      const splitterEntity = entitiesAtNextPos.find(
        (entity) => entity.splitter
      );
      const absorberEntity = entitiesAtNextPos.find(
        (entity) => entity.absorber
      );
      const shieldEntity = entitiesAtNextPos.find((entity) => entity.shield);
      const isShielded =
        shieldEntity &&
        !entitiesAtLastPos.some(
          (e) =>
            e.shield &&
            shieldEntity.shield &&
            e.shield.generator === shieldEntity.shield.generator
        );

      if (isShielded) {
        beam.strength = 0;
      } else if (
        entitiesAtNextPos.some(
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
          createLaser(beam, beam.strength, false, nextPos, source, turn)
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
        const cosmeticEntity = createLaser(
          beam,
          beam.strength,
          false,
          nextPos,
          source,
          turn,
          cosmeticTemplate
        );
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
        const cosmeticEntity = createLaser(
          beam,
          beam.strength,
          false,
          nextPos,
          source,
          turn,
          cosmeticTemplate
        );
        state.act.addEntity(cosmeticEntity);
        beam.dx = newDirection.dx;
        beam.dy = newDirection.dy;
      } else if (solidEntity && solidEntity.destructible) {
        let laserEntity = createLaser(
          beam,
          beam.strength,
          true,
          nextPos,
          source,
          turn
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

  state.act.bordersUpdate();
}

registerHandler(targetWeaponHandler, targetWeapon);
