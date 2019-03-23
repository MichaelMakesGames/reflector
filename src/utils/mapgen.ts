import * as ROT from "rot-js";
import { MAZE_SIZE, MAP_HEIGHT, MAP_WIDTH, ROOM_SIZE } from "../constants";
import { Entity, Level, AIType, Pos, WeaponType } from "../types/Entity";
import { arePositionsEqual } from "./misc";
import { createEntityFromTemplate } from "./createEntityFromTemplate";

export function generateMap(level: Level): Entity[] {
  const rng = ROT.RNG.clone();
  rng.setSeed(level.seed);

  const result: Entity[] = [];
  const floors: Entity[] = [];
  const mazeGenerator = new ROT.Map.DividedMaze(MAZE_SIZE, MAZE_SIZE);
  const maze: { [key: string]: number } = {};
  mazeGenerator.create((x, y, contents) => (maze[`${x},${y}`] = contents));
  for (let y = 0; y < MAP_HEIGHT; y++) {
    for (let x = 0; x < MAP_WIDTH; x++) {
      const mazeX =
        Math.ceil(x / (ROOM_SIZE + 1)) + Math.floor(x / (ROOM_SIZE + 1));
      const mazeY =
        Math.ceil(y / (ROOM_SIZE + 1)) + Math.floor(y / (ROOM_SIZE + 1));
      const key = `${mazeX},${mazeY}`;
      if (maze[key]) {
        result.push(
          createEntityFromTemplate("WALL", {
            pos: { x, y },
            destructible:
              x !== 0 && y !== 0 && x !== MAP_WIDTH - 1 && y !== MAP_HEIGHT - 1
                ? {}
                : undefined,
          }),
        );
      }
      floors.push(
        createEntityFromTemplate("FLOOR", {
          pos: { x, y },
        }),
      );
    }
  }

  function getRandomPos(): Pos {
    let pos: Pos = { x: 0, y: 0 };
    while (
      result.some(
        entity => !!(entity.pos && arePositionsEqual(pos, entity.pos)),
      ) ||
      arePositionsEqual(pos, { x: 1, y: 1 }) ||
      arePositionsEqual(pos, { x: MAP_WIDTH - 2, y: MAP_HEIGHT - 2 })
    ) {
      pos = {
        x: rng.getUniformInt(0, MAP_WIDTH - 1),
        y: rng.getUniformInt(0, MAP_HEIGHT - 1),
      };
    }
    return pos;
  }

  if (!level.final) {
    if (level.depth % 2 === 0) {
      result.push(createEntityFromTemplate("STAIRS", { pos: { x: 1, y: 1 } }));
    } else {
      result.push(
        createEntityFromTemplate("STAIRS", {
          pos: { x: MAP_WIDTH - 2, y: MAP_HEIGHT - 2 },
        }),
      );
    }
  } else {
    const factoryTemplates = [
      "FACTORY_ANGLER",
      "FACTORY_BOMBER",
      "FACTORY_SMASHER",
      "FACTORY_RUSHER",
    ];
    for (let template of factoryTemplates) {
      const position = getRandomPos();
      result.push(createEntityFromTemplate(template, { pos: position }));
    }
  }

  for (let i = 0; i < level.numEnemies; i++) {
    let position = getRandomPos();
    result.push(
      createEntityFromTemplate(
        rng.getWeightedValue(level.aiWeights) as string,
        {
          pos: position,
        },
      ),
    );
  }

  for (let i = 0; i < level.numReflectors; i++) {
    let position = getRandomPos();
    result.push(
      createEntityFromTemplate(
        rng.getUniform() > 0.5 ? "REFLECTOR_UP_RIGHT" : "REFLECTOR_DOWN_RIGHT",
        { pos: position },
      ),
    );
  }

  for (let i = 0; i < level.numSplitters; i++) {
    let position = getRandomPos();
    result.push(
      createEntityFromTemplate(
        rng.getUniform() > 0.5 ? "SPLITTER_HORIZONTAL" : "SPLITTER_VERTICAL",
        { pos: position },
      ),
    );
  }

  for (let i = 0; i < level.numPickups; i++) {
    let position = getRandomPos();
    if (rng.getUniform() > 0.5) {
      result.push(createEntityFromTemplate("MED_KIT", { pos: position }));
    } else {
      result.push(createEntityFromTemplate("RECHARGE_KIT", { pos: position }));
    }
  }

  for (let i = 0; i < 1; i++) {
    const position = getRandomPos();
    const weaponTemplate = rng.getItem<string>(level.possibleWeapons);
    if (weaponTemplate) {
      result.push(createEntityFromTemplate(weaponTemplate, { pos: position }));
    }
  }

  for (let i = 0; i < 2; i++) {
    const position = getRandomPos();
    result.push(createEntityFromTemplate("TELEPORTER", { pos: position }));
  }
  return [...floors, ...result];
}
