import * as ROT from "rot-js";
import { MAZE_SIZE, MAP_HEIGHT, MAP_WIDTH, ROOM_SIZE } from "../constants";
import { Entity } from "../types";
import { makeWall, makeEnemy, makeFirstAidKit, makeRechargeKit } from "./utils";

export function generateMap(): Entity[] {
  const result: Entity[] = [];
  const mazeGenerator = new ROT.Map.DividedMaze(MAZE_SIZE, MAZE_SIZE);
  const maze: { [key: string]: number } = {};
  mazeGenerator.create((x, y, contents) => (maze[`${x},${y}`] = contents));
  const rows: boolean[][] = [];
  for (let y = 0; y < MAP_HEIGHT; y++) {
    const row: boolean[] = [];
    for (let x = 0; x < MAP_WIDTH; x++) {
      const mazeX =
        Math.ceil(x / (ROOM_SIZE + 1)) + Math.floor(x / (ROOM_SIZE + 1));
      const mazeY =
        Math.ceil(y / (ROOM_SIZE + 1)) + Math.floor(y / (ROOM_SIZE + 1));
      const key = `${mazeX},${mazeY}`;
      if (maze[key]) {
        row.push(true);
        result.push(makeWall(x, y));
      } else {
        row.push(false);
      }
      if (
        x % (ROOM_SIZE + 1) === (ROOM_SIZE + 1) / 2 &&
        y % (ROOM_SIZE + 1) === (ROOM_SIZE + 1) / 2
      ) {
        if (Math.random() > 0.5) {
          result.push(makeEnemy(x, y, "RUSHER"));
        } else if (Math.random() > 0.5) {
          result.push(makeFirstAidKit(x, y));
        } else {
          result.push(makeRechargeKit(x, y));
        }
      }
    }
    rows.push(row);
  }
  console.log(
    rows.map(row => row.map(b => (b ? "#" : " ")).join("")).join("\n")
  );
  return result;
}
