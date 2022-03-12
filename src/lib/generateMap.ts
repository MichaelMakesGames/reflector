import { Noise } from "rot-js";
import { Required } from "ts-toolbelt/out/Object/Required";
import {
  MAP_HEIGHT,
  MAP_WIDTH,
  NEW_COLONISTS_PER_DAY,
  PLAYER_ID,
} from "../constants";
import mapTypes from "../data/mapTypes";
import { Entity } from "../types/Entity";
import { TemplateName } from "../types/TemplateName";
import { createEntityFromTemplate } from "./entities";
import { arePositionsEqual, getDistance } from "./geometry";
import { calcPercentile, rangeTo, sum } from "./math";
import { choose } from "./rng";

export default function generateMap(mapType: string): Entity[] {
  let results: Entity[] = [];

  const config = mapTypes[mapType];

  const noiseGenerator = new Noise.Simplex();
  const noise: number[][] = [];
  for (const x of rangeTo(MAP_WIDTH)) {
    noise.push([]);
    for (const y of rangeTo(MAP_HEIGHT)) {
      noise[x].push(
        noiseGenerator.get(x / config.smoothness, y / config.smoothness)
      );
    }
  }

  const flatNoise = noise.flat().sort((a, b) => a - b);

  const totalWeight = sum(...Object.values(config.terrainWeights));
  const waterFertileThreshold = calcPercentile(
    flatNoise,
    (config.terrainWeights.water / totalWeight) * 100
  );
  const fertileFloorThreshold = calcPercentile(
    flatNoise,
    ((config.terrainWeights.water + config.terrainWeights.fertile) /
      totalWeight) *
      100
  );
  const floorOreThreshold = calcPercentile(
    flatNoise,
    ((config.terrainWeights.water +
      config.terrainWeights.fertile +
      config.terrainWeights.ground) /
      totalWeight) *
      100
  );
  const oreMountainThreshold = calcPercentile(
    flatNoise,
    ((config.terrainWeights.water +
      config.terrainWeights.fertile +
      config.terrainWeights.ground +
      config.terrainWeights.ore) /
      totalWeight) *
      100
  );

  for (let y = -1; y < MAP_HEIGHT + 1; y++) {
    for (let x = -1; x < MAP_WIDTH + 1; x++) {
      if (y === -1 || x === -1 || y === MAP_HEIGHT || x === MAP_WIDTH) {
        results.push(
          createEntityFromTemplate("BUILDING_WALL", {
            pos: { x, y },
            destructible: undefined,
            description: { name: "Map Edge", description: "" },
          })
        );
      } else {
        const localNoise = noise[x][y];
        let template: TemplateName = "TERRAIN_GROUND";
        if (localNoise < waterFertileThreshold) {
          template = "TERRAIN_WATER_BASE";
        } else if (localNoise < fertileFloorThreshold) {
          template = "TERRAIN_FERTILE";
        } else if (localNoise < floorOreThreshold) {
          template = "TERRAIN_GROUND";
        } else if (localNoise < oreMountainThreshold) {
          template = "TERRAIN_ORE";
        } else {
          template = "TERRAIN_MOUNTAIN";
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
          template = "TERRAIN_GROUND";
        }
        let entity = createEntityFromTemplate(template, {
          pos: { x, y },
        });
        if (
          ["TERRAIN_FERTILE", "TERRAIN_ORE"].includes(template) &&
          entity.display
        ) {
          entity = {
            ...entity,
            display: {
              ...entity.display,
              rotation: choose([0, 90, 180, 270]),
            },
          };
        }
        results.push(entity);
      }
    }
  }

  const centerPos = {
    x: Math.floor(MAP_WIDTH / 2),
    y: Math.floor(MAP_HEIGHT / 2),
  };
  const floorPositions = (results as Required<Entity, "pos">[])
    .filter((entity) => entity.template === "TERRAIN_GROUND")
    .map((entity) => entity.pos)
    .sort((a, b) => getDistance(a, centerPos) - getDistance(b, centerPos));

  const waterEntities = (results as Required<Entity, "pos">[]).filter(
    (entity) => entity.template === "TERRAIN_WATER_BASE"
  );
  results = results.filter(
    (e) => !waterEntities.includes(e as Required<Entity, "pos">)
  );
  waterEntities.forEach((waterEntity) => {
    const { pos } = waterEntity;
    const nIsWater = waterEntities.some((e) =>
      arePositionsEqual(e.pos, { x: pos.x, y: pos.y - 1 })
    );
    const neIsWater = waterEntities.some((e) =>
      arePositionsEqual(e.pos, { x: pos.x + 1, y: pos.y - 1 })
    );
    const eIsWater = waterEntities.some((e) =>
      arePositionsEqual(e.pos, { x: pos.x + 1, y: pos.y })
    );
    const seIsWater = waterEntities.some((e) =>
      arePositionsEqual(e.pos, { x: pos.x + 1, y: pos.y + 1 })
    );
    const sIsWater = waterEntities.some((e) =>
      arePositionsEqual(e.pos, { x: pos.x, y: pos.y + 1 })
    );
    const swIsWater = waterEntities.some((e) =>
      arePositionsEqual(e.pos, { x: pos.x - 1, y: pos.y + 1 })
    );
    const wIsWater = waterEntities.some((e) =>
      arePositionsEqual(e.pos, { x: pos.x - 1, y: pos.y })
    );
    const nwIsWater = waterEntities.some((e) =>
      arePositionsEqual(e.pos, { x: pos.x - 1, y: pos.y - 1 })
    );
    const waterNumber =
      0 +
      (nIsWater ? 1 : 0) +
      (eIsWater ? 2 : 0) +
      (sIsWater ? 4 : 0) +
      (wIsWater ? 8 : 0);
    results.push(
      createEntityFromTemplate(`TERRAIN_WATER_${waterNumber}` as TemplateName, {
        pos,
      })
    );
    if (nIsWater && eIsWater && neIsWater) {
      results.push(
        createEntityFromTemplate("TERRAIN_WATER_CORNER_NE", { pos })
      );
    }
    if (sIsWater && eIsWater && seIsWater) {
      results.push(
        createEntityFromTemplate("TERRAIN_WATER_CORNER_SE", { pos })
      );
    }
    if (sIsWater && wIsWater && swIsWater) {
      results.push(
        createEntityFromTemplate("TERRAIN_WATER_CORNER_SW", { pos })
      );
    }
    if (nIsWater && wIsWater && nwIsWater) {
      results.push(
        createEntityFromTemplate("TERRAIN_WATER_CORNER_NW", { pos })
      );
    }
  });

  rangeTo(NEW_COLONISTS_PER_DAY).forEach((i) => {
    results.push(
      createEntityFromTemplate("COLONIST", {
        pos: floorPositions[i],
      })
    );
  });

  results.push({
    ...createEntityFromTemplate("PLAYER"),
    pos: floorPositions[4],
    id: PLAYER_ID,
  });

  return results;
}
