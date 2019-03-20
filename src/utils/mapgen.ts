import * as ROT from "rot-js";
import { MAZE_SIZE, MAP_HEIGHT, MAP_WIDTH, ROOM_SIZE } from "../constants";
import { Entity, Level, AIType, Position, WeaponType } from "../types/types";
import { arePositionsEqual } from "./misc";
import { createEntityFromTemplate } from "./createEntityFromTemplate";

export function generateMap(level: Level): Entity[] {
  const rng = ROT.RNG.clone();
  rng.setSeed(level.seed);

  const result: Entity[] = [];
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
            position: { x, y },
            destructible:
              x !== 0 && y !== 0 && x !== MAP_WIDTH - 1 && y !== MAP_HEIGHT - 1
                ? {}
                : undefined,
          }),
        );
      }
    }
  }

  function getRandomPos(): Position {
    let pos: Position = { x: 0, y: 0 };
    while (
      result.some(
        entity =>
          !!(entity.position && arePositionsEqual(pos, entity.position)),
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
      result.push(
        createEntityFromTemplate("STAIRS", { position: { x: 1, y: 1 } }),
      );
    } else {
      result.push(
        createEntityFromTemplate("STAIRS", {
          position: { x: MAP_WIDTH - 2, y: MAP_HEIGHT - 2 },
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
      result.push(createEntityFromTemplate(template, { position }));
    }
  }

  for (let i = 0; i < level.numEnemies; i++) {
    let position = getRandomPos();
    result.push(
      createEntityFromTemplate(
        rng.getWeightedValue(level.aiWeights) as string,
        {
          position,
        },
      ),
    );
  }

  for (let i = 0; i < level.numReflectors; i++) {
    let position = getRandomPos();
    result.push(
      createEntityFromTemplate(
        rng.getUniform() > 0.5 ? "REFLECTOR_UP_RIGHT" : "REFLECTOR_DOWN_RIGHT",
        { position },
      ),
    );
  }

  for (let i = 0; i < level.numSplitters; i++) {
    let position = getRandomPos();
    result.push(
      createEntityFromTemplate(
        rng.getUniform() > 0.5 ? "SPLITTER_HORIZONTAL" : "SPLITTER_VERTICAL",
        { position },
      ),
    );
  }

  for (let i = 0; i < level.numPickups; i++) {
    let position = getRandomPos();
    if (rng.getUniform() > 0.5) {
      result.push(createEntityFromTemplate("MED_KIT", { position }));
    } else {
      result.push(createEntityFromTemplate("RECHARGE_KIT", { position }));
    }
  }

  for (let i = 0; i < 1; i++) {
    const position = getRandomPos();
    const weaponTemplate = rng.getItem<string>(level.possibleWeapons);
    if (weaponTemplate) {
      result.push(createEntityFromTemplate(weaponTemplate, { position }));
    }
  }

  for (let i = 0; i < 2; i++) {
    const position = getRandomPos();
    result.push(createEntityFromTemplate("TELEPORTER", { position }));
  }
  return result;
}
