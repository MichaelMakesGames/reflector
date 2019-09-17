import { Pos, WeaponType, Direction, HasDisplay, Entity } from "~/types";
import { RED, RIGHT, DOWN, LEFT, UP, PURPLE, YELLOW } from "~/constants";
import { createEntityFromTemplate } from "./entities";
import { getConstDir } from "./geometry";

export function createLaser(
  direction: Direction,
  power: number,
  hit: boolean,
  type: WeaponType,
  pos: Pos,
): Entity {
  let color = RED;
  if (type === "TELEPORT") color = PURPLE;
  if (type === "ELECTRIC") color = YELLOW;

  let templateName = "LASER_";
  if (hit) {
    templateName += "BURST";
  } else {
    const constDir = getConstDir(direction);
    if (constDir === UP || constDir === DOWN) {
      templateName += "VERTICAL_";
    } else {
      templateName += "HORIZONTAL_";
    }
    if (power >= 3) {
      templateName += "THICK";
    } else if (power === 2) {
      templateName += "MEDIUM";
    } else {
      templateName += "THIN";
    }
  }

  const template = createEntityFromTemplate(templateName, { pos }) as Entity &
    HasDisplay;
  return {
    ...template,
    display: {
      ...template.display,
      color,
    },
  };
}

export function reflect(
  direction: { dx: number; dy: number },
  reflectorType: "\\" | "/",
): { dx: number; dy: number } {
  const d = direction;
  if (reflectorType === "\\") {
    if (getConstDir(d) === RIGHT) return DOWN;
    if (getConstDir(d) === DOWN) return RIGHT;
    if (getConstDir(d) === LEFT) return UP;
    if (getConstDir(d) === UP) return LEFT;
    return direction;
  }
  if (getConstDir(d) === RIGHT) return UP;
  if (getConstDir(d) === DOWN) return LEFT;
  if (getConstDir(d) === LEFT) return DOWN;
  if (getConstDir(d) === UP) return RIGHT;
  return direction;
}
