import { Level } from "./types";
import { RNG } from "rot-js";

export function getLevels(): Level[] {
  const rng = RNG.clone();
  return [
    {
      current: true,
      final: false,
      depth: 0,
      seed: 0,
      aiWeights: {},
      numEnemies: 0
    },
    {
      current: false,
      final: false,
      depth: 1,
      seed: rng.getUniform(),
      numEnemies: 10,
      aiWeights: {
        RUSHER: 10
        // ANGLER: 10,
        // SMASHER: 10,
        // BOMBER: 10
      }
    },
    {
      current: false,
      final: false,
      depth: 2,
      seed: rng.getUniform(),
      numEnemies: 15,
      aiWeights: {
        RUSHER: 10,
        ANGLER: 10
        // SMASHER: 10,
        // BOMBER: 10
      }
    },
    {
      current: false,
      final: false,
      depth: 3,
      seed: rng.getUniform(),
      numEnemies: 20,
      aiWeights: {
        RUSHER: 10,
        ANGLER: 10,
        SMASHER: 10
        // BOMBER: 10
      }
    },
    {
      current: false,
      final: false,
      depth: 4,
      seed: rng.getUniform(),
      numEnemies: 20,
      aiWeights: {
        RUSHER: 10,
        ANGLER: 10,
        SMASHER: 10,
        BOMBER: 10
      }
    },
    {
      current: false,
      final: true,
      depth: 5,
      seed: rng.getUniform(),
      numEnemies: 20,
      aiWeights: {
        RUSHER: 10,
        SMASHER: 10,
        ANGLER: 10,
        BOMBER: 10
      }
    }
  ];
}
