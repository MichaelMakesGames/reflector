import * as ROT from "rot-js";
import { MAZE_SIZE, MAP_HEIGHT, MAP_WIDTH, ROOM_SIZE } from "./constants";
import { Entity, Level, AIType, Position } from "./types";
import {
  makeWall,
  makeEnemy,
  makeFirstAidKit,
  makeRechargeKit,
  makeStairs,
  isPosEqual,
  makeReflector,
  makeSplitter
} from "./utils";

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
          makeWall(
            x,
            y,
            x !== 0 && y !== 0 && x !== MAP_WIDTH - 1 && y !== MAP_HEIGHT - 1
          )
        );
      }
    }
  }

  if (!level.final) {
    if (level.depth % 2 === 0) {
      result.push(makeStairs({ x: 1, y: 1 }));
    } else {
      result.push(makeStairs({ x: MAP_WIDTH - 2, y: MAP_HEIGHT - 2 }));
    }
  }

  function getRandomPos(): Position {
    let pos: Position = { x: 0, y: 0 };
    while (
      result.some(
        entity => !!(entity.position && isPosEqual(pos, entity.position))
      ) ||
      isPosEqual(pos, { x: 1, y: 1 }) ||
      isPosEqual(pos, { x: MAP_WIDTH - 2, y: MAP_HEIGHT - 2 })
    ) {
      pos = {
        x: rng.getUniformInt(0, MAP_WIDTH - 1),
        y: rng.getUniformInt(0, MAP_HEIGHT - 1)
      };
    }
    return pos;
  }

  for (let i = 0; i < level.numEnemies; i++) {
    let pos = getRandomPos();
    result.push(
      makeEnemy(pos.x, pos.y, rng.getWeightedValue(level.aiWeights) as AIType)
    );
  }

  for (let i = 0; i < level.numReflectors; i++) {
    let pos = getRandomPos();
    result.push(
      makeReflector(pos.x, pos.y, rng.getUniform() > 0.5 ? "\\" : "/")
    );
  }

  for (let i = 0; i < level.numSplitters; i++) {
    let pos = getRandomPos();
    result.push(
      makeSplitter(
        pos.x,
        pos.y,
        rng.getUniform() > 0.5 ? "horizontal" : "vertical"
      )
    );
  }

  for (let i = 0; i < level.numPickups; i++) {
    let pos = getRandomPos();
    if (rng.getUniform() > 0.5) {
      result.push(makeFirstAidKit(pos.x, pos.y));
    } else {
      result.push(makeRechargeKit(pos.y, pos.y));
    }
  }
  return result;
}
