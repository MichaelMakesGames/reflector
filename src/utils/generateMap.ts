import * as ROT from "rot-js";
import { MAZE_SIZE, MAP_HEIGHT, MAP_WIDTH, ROOM_SIZE } from "~/constants";
import { Entity, Pos } from "~/types/Entity";
import { arePositionsEqual } from "./geometry";
import { createEntityFromTemplate } from "./entities";

export default function generateMap(): Entity[] {
  const rng = ROT.RNG.clone();

  const result: Entity[] = [];
  const floors: Entity[] = [];
  const mazeGenerator = new ROT.Map.DividedMaze(MAZE_SIZE, MAZE_SIZE);
  const maze: { [key: string]: number } = {};
  mazeGenerator.create((x, y, contents) => {
    maze[`${x},${y}`] = contents;
  });

  function isWall(x: number, y: number) {
    const mazeX =
      Math.ceil(x / (ROOM_SIZE + 1)) + Math.floor(x / (ROOM_SIZE + 1));
    const mazeY =
      Math.ceil(y / (ROOM_SIZE + 1)) + Math.floor(y / (ROOM_SIZE + 1));
    const key = `${mazeX},${mazeY}`;
    return maze[key];
  }

  for (let y = 0; y < MAP_HEIGHT; y++) {
    for (let x = 0; x < MAP_WIDTH; x++) {
      if (isWall(x, y)) {
        let wallBitmap = 0;
        if (isWall(x, y - 1)) {
          wallBitmap += 1;
        }
        if (isWall(x + 1, y)) {
          wallBitmap += 2;
        }
        if (isWall(x, y + 1)) {
          wallBitmap += 4;
        }
        if (isWall(x - 1, y)) {
          wallBitmap += 8;
        }

        result.push(
          createEntityFromTemplate(`WALL_${wallBitmap}`, {
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

  result.push(
    createEntityFromTemplate("ENEMY_RUSHER", {
      pos: {
        x: MAP_WIDTH - 2,
        y: MAP_HEIGHT - 2,
      },
    }),
  );

  return [...floors, ...result];
}
