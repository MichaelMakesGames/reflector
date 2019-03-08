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
      numSplitters: 0,
      numReflectors: 0,
      numPickups: 0,
      numEnemies: 0,
      possibleWeapons: [],
    },
    {
      current: false,
      final: false,
      depth: 1,
      seed: rng.getUniform(),
      numEnemies: 10,
      numSplitters: 1,
      numReflectors: 5,
      numPickups: 3,
      aiWeights: {
        ENEMY_RUSHER: 10,
        // ENEMY_ANGLER: 10,
        // ENEMY_SMASHER: 10,
        // ENEMY_BOMBER: 10
      },
      possibleWeapons: ["WEAPON_TELEPORTER", "WEAPON_FAST_LASER"],
    },
    {
      current: false,
      final: false,
      depth: 2,
      seed: rng.getUniform(),
      numEnemies: 15,
      numSplitters: 1,
      numReflectors: 5,
      numPickups: 3,
      aiWeights: {
        ENEMY_RUSHER: 10,
        ENEMY_ANGLER: 10,
        // ENEMY_SMASHER: 10,
        // ENEMY_BOMBER: 10
      },
      possibleWeapons: [
        "WEAPON_TELEPORTER",
        "WEAPON_LIGHTNING_GUN",
        "WEAPON_COMBUSTION_BEAM",
      ],
    },
    {
      current: false,
      final: false,
      depth: 3,
      seed: rng.getUniform(),
      numEnemies: 20,
      numSplitters: 1,
      numReflectors: 5,
      numPickups: 3,
      aiWeights: {
        ENEMY_RUSHER: 10,
        ENEMY_ANGLER: 10,
        ENEMY_SMASHER: 10,
        // ENEMY_BOMBER: 10
      },
      possibleWeapons: [
        "WEAPON_HEAVY_LASER",
        "WEAPON_LIGHTNING_GUN",
        "WEAPON_COMBUSTION_BEAM",
      ],
    },
    {
      current: false,
      final: false,
      depth: 4,
      seed: rng.getUniform(),
      numEnemies: 20,
      numSplitters: 1,
      numReflectors: 5,
      numPickups: 3,
      aiWeights: {
        ENEMY_RUSHER: 10,
        ENEMY_ANGLER: 10,
        ENEMY_SMASHER: 10,
        ENEMY_BOMBER: 10,
      },
      possibleWeapons: ["WEAPON_END_BRINGER", "WEAPON_STORM_CANNON"],
    },
    {
      current: false,
      final: true,
      depth: 5,
      seed: rng.getUniform(),
      numEnemies: 20,
      numSplitters: 1,
      numReflectors: 5,
      numPickups: 3,
      aiWeights: {
        ENEMY_RUSHER: 10,
        ENEMY_SMASHER: 10,
        ENEMY_ANGLER: 10,
        ENEMY_BOMBER: 10,
      },
      possibleWeapons: [],
    },
  ];
}
