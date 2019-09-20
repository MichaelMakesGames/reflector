import { MAP_HEIGHT, MAP_WIDTH } from "~/constants";
import { Entity } from "~/types/Entity";
import { createEntityFromTemplate } from "./entities";

export default function generateMap(): Entity[] {
  const result: Entity[] = [];

  for (let y = -1; y < MAP_HEIGHT + 1; y++) {
    for (let x = -1; x < MAP_WIDTH + 1; x++) {
      if (y === -1 || x === -1 || y === MAP_HEIGHT || x === MAP_WIDTH) {
        result.push(
          createEntityFromTemplate("WALL_0", {
            pos: { x, y },
          }),
        );
      } else {
        result.push(
          createEntityFromTemplate("FLOOR", {
            pos: { x, y },
          }),
        );
      }
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

  result.push(
    createEntityFromTemplate("TENT", {
      pos: {
        x: Math.floor(MAP_WIDTH / 2),
        y: Math.floor(MAP_HEIGHT / 2),
      },
    }),
  );

  return result;
}
