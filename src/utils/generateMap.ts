import { Noise } from "rot-js";
import { MAP_HEIGHT, MAP_WIDTH, PLAYER_ID } from "~/constants";
import { Entity } from "~/types/Entity";
import { createEntityFromTemplate } from "./entities";
import { getDistance, arePositionsEqual } from "./geometry";
import { MakeRequired } from "~types";

export default function generateMap(): Entity[] {
  let result: Entity[] = [];

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
          template = "WATER_BASE";
        } else if (localNoise > 0.75) {
          template = "MOUNTAIN";
        } else if (localNoise > 0.7) {
          template = "ORE";
        } else if (Math.random() < 0.01) {
          template = "ORE";
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

  const waterEntities = (result as MakeRequired<Entity, "pos">[]).filter(
    entity => entity.id.startsWith("WATER_BASE"),
  );
  result = result.filter(
    e => !waterEntities.includes(e as MakeRequired<Entity, "pos">),
  );
  waterEntities.forEach(waterEntity => {
    const { pos } = waterEntity;
    const nIsWater = waterEntities.some(e =>
      arePositionsEqual(e.pos, { x: pos.x, y: pos.y - 1 }),
    );
    const neIsWater = waterEntities.some(e =>
      arePositionsEqual(e.pos, { x: pos.x + 1, y: pos.y - 1 }),
    );
    const eIsWater = waterEntities.some(e =>
      arePositionsEqual(e.pos, { x: pos.x + 1, y: pos.y }),
    );
    const seIsWater = waterEntities.some(e =>
      arePositionsEqual(e.pos, { x: pos.x + 1, y: pos.y + 1 }),
    );
    const sIsWater = waterEntities.some(e =>
      arePositionsEqual(e.pos, { x: pos.x, y: pos.y + 1 }),
    );
    const swIsWater = waterEntities.some(e =>
      arePositionsEqual(e.pos, { x: pos.x - 1, y: pos.y + 1 }),
    );
    const wIsWater = waterEntities.some(e =>
      arePositionsEqual(e.pos, { x: pos.x - 1, y: pos.y }),
    );
    const nwIsWater = waterEntities.some(e =>
      arePositionsEqual(e.pos, { x: pos.x - 1, y: pos.y - 1 }),
    );
    const waterNumber =
      0 +
      (nIsWater ? 1 : 0) +
      (eIsWater ? 2 : 0) +
      (sIsWater ? 4 : 0) +
      (wIsWater ? 8 : 0);
    result.push(createEntityFromTemplate(`WATER_${waterNumber}`, { pos }));
    if (nIsWater && eIsWater && neIsWater) {
      result.push(createEntityFromTemplate("WATER_CORNER_NE", { pos }));
    }
    if (sIsWater && eIsWater && seIsWater) {
      result.push(createEntityFromTemplate("WATER_CORNER_SE", { pos }));
    }
    if (sIsWater && wIsWater && swIsWater) {
      result.push(createEntityFromTemplate("WATER_CORNER_SW", { pos }));
    }
    if (nIsWater && wIsWater && nwIsWater) {
      result.push(createEntityFromTemplate("WATER_CORNER_NW", { pos }));
    }
  });

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

  return result;
}
