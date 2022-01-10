import { RNG } from "rot-js";
import { TemplateName } from "../../types/TemplateName";
import {
  END_OF_NIGHT_ENEMY_SPAWNING_BUFFER,
  WAVE_SIZE_DAY_MULTIPLIER,
  WAVE_SIZE_POPULATION_MULTIPLIER,
  MAP_HEIGHT,
  MAP_WIDTH,
  TURNS_PER_DAY,
  WAVE_SIZE_CONSTANT,
  TURNS_PER_NIGHT,
} from "../../constants";
import { createEntityFromTemplate } from "../../lib/entities";
import { distribute, rangeTo } from "../../lib/math";
import { choose, pickWeighted } from "../../lib/rng";
import { Pos } from "../../types";
import WrappedState from "../../types/WrappedState";
import mapTypes from "../../data/mapTypes";

export default function waveSystem(state: WrappedState): void {
  if (
    state.select.isNight() &&
    state.select.turnOfDay() <
      TURNS_PER_DAY - END_OF_NIGHT_ENEMY_SPAWNING_BUFFER &&
    state.select.turnOfDay() !== 0
  ) {
    const day = state.select.day();
    const waveSize =
      WAVE_SIZE_CONSTANT +
      WAVE_SIZE_POPULATION_MULTIPLIER * state.select.population() +
      WAVE_SIZE_DAY_MULTIPLIER * day;
    const numberOfSpawnTurns =
      TURNS_PER_NIGHT - END_OF_NIGHT_ENEMY_SPAWNING_BUFFER;
    const spawnsThisTurn =
      distribute(waveSize, numberOfSpawnTurns)[state.select.turnOfNight()] || 0;

    const { enemyWeightMultipliers } =
      mapTypes[state.raw.mapType ?? "standard"];

    rangeTo(spawnsThisTurn).forEach(() =>
      spawnEnemy(state, {
        ENEMY_DRONE: 5 * (enemyWeightMultipliers.ENEMY_DRONE ?? 1),
        ENEMY_ARMORED: Math.max(
          0,
          0 + 0.25 * day * (enemyWeightMultipliers.ENEMY_ARMORED ?? 1)
        ),
        ENEMY_FLYER: Math.max(
          0,
          0 + 0.25 * day * (enemyWeightMultipliers.ENEMY_FLYER ?? 1)
        ),
        ENEMY_BURROWER: Math.max(
          0,
          0 + 0.25 * day * (enemyWeightMultipliers.ENEMY_BURROWER ?? 1)
        ),
        ENEMY_VOLATILE: Math.max(
          0,
          0 + 0.25 * day * (enemyWeightMultipliers.ENEMY_VOLATILE ?? 1)
        ),
      })
    );
  }
}

function spawnEnemy(
  state: WrappedState,
  weights: Record<string, number>
): void {
  const positions = getPossibleSpawnPositions(state);
  if (positions.length) {
    const pos = choose(positions);
    state.act.addEntity(
      createEntityFromTemplate(RNG.getWeightedValue(weights) as TemplateName, {
        pos,
      })
    );
  } else {
    console.error("Unable to find enemy spawn position");
  }
}

function getPossibleSpawnPositions(state: WrappedState): Pos[] {
  const unfilteredPositions: Pos[] = [];

  const direction = pickWeighted(
    Object.entries(state.raw.time.directionWeights)
  );

  if (direction === "n") {
    for (const x of rangeTo(MAP_WIDTH)) {
      const y = 0;
      unfilteredPositions.push({ x, y });
    }
  }

  if (direction === "s") {
    for (const x of rangeTo(MAP_WIDTH)) {
      const y = MAP_HEIGHT - 1;
      unfilteredPositions.push({ x, y });
    }
  }

  if (direction === "w") {
    for (const y of rangeTo(MAP_HEIGHT)) {
      const x = 0;
      unfilteredPositions.push({ x, y });
    }
  }

  if (direction === "e") {
    for (const y of rangeTo(MAP_HEIGHT)) {
      const x = MAP_WIDTH - 1;
      unfilteredPositions.push({ x, y });
    }
  }

  return unfilteredPositions.filter(
    (pos) => !state.select.isPositionBlocked(pos)
  );
}
