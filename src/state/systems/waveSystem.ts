import { RNG } from "rot-js";
import { TemplateName } from "../../types/TemplateName";
import {
  END_OF_NIGHT_ENEMY_SPAWNING_BUFFER,
  ENEMIES_PER_TURN_DAY_MULTIPLIER,
  ENEMIES_PER_TURN_POPULATION_MULTIPLIER,
  MAP_HEIGHT,
  MAP_WIDTH,
  TURNS_PER_DAY,
} from "../../constants";
import { createEntityFromTemplate } from "../../lib/entities";
import { rangeTo } from "../../lib/math";
import { choose, pickWeighted } from "../../lib/rng";
import { Pos } from "../../types";
import WrappedState from "../../types/WrappedState";

export default function waveSystem(state: WrappedState): void {
  if (
    state.select.isNight() &&
    state.select.turnOfDay() <
      TURNS_PER_DAY - END_OF_NIGHT_ENEMY_SPAWNING_BUFFER &&
    state.select.turnOfDay() !== 0
  ) {
    let numberOfSpawns =
      ENEMIES_PER_TURN_POPULATION_MULTIPLIER * state.select.population() +
      ENEMIES_PER_TURN_DAY_MULTIPLIER * state.select.day();
    if (Math.floor(numberOfSpawns) !== numberOfSpawns) {
      numberOfSpawns =
        Math.floor(numberOfSpawns) +
        (Math.random() < numberOfSpawns % 1 ? 1 : 0);
    }
    // always spawn at least 1 enemy on the first turn of night
    if (state.select.turnOfNight() === 1 && numberOfSpawns < 1) {
      numberOfSpawns = 1;
    }
    rangeTo(numberOfSpawns).forEach(() => spawnEnemy(state));
  }
}

function spawnEnemy(state: WrappedState): void {
  const positions = getPossibleSpawnPositions(state);
  if (positions.length) {
    const pos = choose(positions);
    state.act.addEntity(
      createEntityFromTemplate(
        RNG.getWeightedValue({
          // ENEMY_DRONE: 1,
          // ENEMY_ARMORED: 1,
          // ENEMY_FLYER: 1,
          ENEMY_BURROWER: 1,
          // ENEMY_VOLATILE: 1,
        }) as TemplateName,
        { pos }
      )
    );
  } else {
    console.warn("Unable to find spawn position");
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
