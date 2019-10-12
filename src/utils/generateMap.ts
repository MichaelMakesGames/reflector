import { Noise } from "rot-js";
import { MAP_HEIGHT, MAP_WIDTH, PLAYER_ID } from "~/constants";
import { Entity } from "~/types/Entity";
import { createEntityFromTemplate } from "./entities";
import { getDistance } from "./geometry";
import { MakeRequired } from "~types";

export default function generateMap(): Entity[] {
  const result: Entity[] = [];

  const noise = new Noise.Simplex();

  for (let y = -1; y < MAP_HEIGHT + 1; y++) {
    for (let x = -1; x < MAP_WIDTH + 1; x++) {
      if (y === -1 || x === -1 || y === MAP_HEIGHT || x === MAP_WIDTH) {
        result.push(
          createEntityFromTemplate("WALL", {
            pos: { x, y },
            destructible: undefined,
          }),
        );
      } else {
        const localNoise = noise.get(x / 15, y / 15);
        let template = "FLOOR";
        if (localNoise < -0.75) {
          template = "WATER";
        } else if (localNoise > 0.75) {
          template = "MOUNTAIN";
        }
        if (
          x === 0 ||
          y === 0 ||
          x === MAP_WIDTH - 1 ||
          y === MAP_HEIGHT - 1 ||
          (x === 1 && y === 1) ||
          (x === 1 && y === MAP_HEIGHT - 2) ||
          (x === MAP_WIDTH - 2 && y === 1) ||
          (x === MAP_WIDTH - 2 && y === MAP_HEIGHT - 2)
        ) {
          template = "FLOOR";
        }
        result.push(
          createEntityFromTemplate(template, {
            pos: { x, y },
          }),
        );
      }
    }
  }

  const centerPos = {
    x: Math.floor(MAP_WIDTH / 2),
    y: Math.floor(MAP_HEIGHT / 2),
  };
  const floorPositions = (result as MakeRequired<Entity, "pos">[])
    .filter(entity => entity.id.startsWith("FLOOR"))
    .map(entity => entity.pos)
    .sort((a, b) => getDistance(a, centerPos) - getDistance(b, centerPos));

  result.push(
    createEntityFromTemplate("TENT", {
      pos: floorPositions[0],
    }),
  );

  result.push({
    ...createEntityFromTemplate("PLAYER"),
    pos: floorPositions[10],
    id: PLAYER_ID,
  });

  result.push(
    createEntityFromTemplate("MINE", {
      pos: floorPositions[20],
    }),
  );

  return result;
}
