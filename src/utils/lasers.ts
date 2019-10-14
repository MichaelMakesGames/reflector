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

  let templateName = `LASER_${getOrientation(direction)}_${getThickness(
    power,
  )}`;
  if (hit) {
    templateName = "LASER_BURST";
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
  previousDirection: Direction,
  reflectorType: "\\" | "/",
  power: number,
): { direction: Direction; cosmeticTemplate: string } {
  const constPrevDir = getConstDir(previousDirection);
  let newDirection = constPrevDir;
  if (reflectorType === "\\") {
    if (constPrevDir === RIGHT) newDirection = DOWN;
    if (constPrevDir === DOWN) newDirection = RIGHT;
    if (constPrevDir === LEFT) newDirection = UP;
    if (constPrevDir === UP) newDirection = LEFT;
  } else {
    if (constPrevDir === RIGHT) newDirection = UP;
    if (constPrevDir === DOWN) newDirection = LEFT;
    if (constPrevDir === LEFT) newDirection = DOWN;
    if (constPrevDir === UP) newDirection = RIGHT;
  }
  const cosmeticTemplate = getReflectedTemplateName(
    power,
    previousDirection,
    newDirection,
  );
  return { direction: newDirection, cosmeticTemplate };
}

export function getSplitTemplateName(power: number, direction: Direction) {
  return `LASER_SPLIT_${getThickness(power)}_TO_${getThickness(
    power - 1,
  )}_${getSplitOrientation(direction)}`;
}

function getReflectedTemplateName(
  power: number,
  from: Direction,
  to: Direction,
) {
  return `LASER_REFLECTED_${getThickness(power)}_${getReflectedOrientation(
    from,
    to,
  )}`;
}

function getThickness(power: number) {
  if (power >= 3) return "THICK";
  if (power === 2) return "MEDIUM";
  if (power === 1) return "THIN";
  return "NONE";
}

function getOrientation(direction: Direction) {
  const constDir = getConstDir(direction);
  if (constDir === UP || constDir === DOWN) {
    return "VERTICAL";
  } else {
    return "HORIZONTAL";
  }
}

function getReflectedOrientation(from: Direction, to: Direction) {
  const constFrom = getConstDir(from);
  const constTo = getConstDir(to);
  if (
    (constFrom === DOWN && constTo === LEFT) ||
    (constTo === UP && constFrom === RIGHT)
  ) {
    return "UP_LEFT";
  }
  if (
    (constFrom === DOWN && constTo === RIGHT) ||
    (constTo === UP && constFrom === LEFT)
  ) {
    return "UP_RIGHT";
  }
  if (
    (constFrom === UP && constTo === LEFT) ||
    (constTo === DOWN && constFrom === RIGHT)
  ) {
    return "DOWN_LEFT";
  }
  if (
    (constFrom === UP && constTo === RIGHT) ||
    (constTo === DOWN && constFrom === LEFT)
  ) {
    return "DOWN_RIGHT";
  }
  return "";
}

function getSplitOrientation(direction: Direction) {
  const constDir = getConstDir(direction);
  if (constDir === UP) return "UP";
  if (constDir === DOWN) return "DOWN";
  if (constDir === LEFT) return "LEFT";
  return "RIGHT";
}
