import { TemplateName } from "../types/TemplateName";

interface MapType {
  terrainWeights: {
    water: number;
    fertile: number;
    ground: number;
    ore: number;
    mountain: number;
  };
  smoothness: number;
  enemyWeightMultipliers: Partial<Record<TemplateName, number>>;
}

const mapTypes: Record<string, MapType> = {
  standard: {
    terrainWeights: {
      water: 15,
      fertile: 10,
      ground: 60,
      ore: 1.5,
      mountain: 13.5,
    },
    smoothness: 12,
    enemyWeightMultipliers: { ENEMY_ARMORED: 1.5 },
  },
  marsh: {
    terrainWeights: {
      water: 30,
      fertile: 33,
      ground: 35,
      ore: 1,
      mountain: 1,
    },
    smoothness: 6,
    enemyWeightMultipliers: { ENEMY_FLYER: 2 },
  },
  badlands: {
    terrainWeights: {
      water: 1,
      fertile: 1.5,
      ground: 65.5,
      ore: 5,
      mountain: 27,
    },
    smoothness: 6,
    enemyWeightMultipliers: { ENEMY_BURROWER: 2 },
  },
  plains: {
    terrainWeights: {
      water: 5,
      fertile: 10,
      ground: 80,
      ore: 1.5,
      mountain: 3.5,
    },
    smoothness: 15,
    enemyWeightMultipliers: { ENEMY_ARMORED: 1.5 },
  },
  mesa: {
    terrainWeights: {
      water: 1,
      fertile: 1.5,
      ground: 65.5,
      ore: 5,
      mountain: 27,
    },
    smoothness: 15,
    enemyWeightMultipliers: { ENEMY_BURROWER: 2 },
  },
  lakes: {
    terrainWeights: {
      water: 30,
      fertile: 33,
      ground: 35,
      ore: 1,
      mountain: 1,
    },
    smoothness: 15,
    enemyWeightMultipliers: { ENEMY_FLYER: 2 },
  },
};

export default mapTypes;
