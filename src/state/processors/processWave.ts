import {
  ENEMIES_PER_TURN_DAY_MULTIPLIER,
  ENEMIES_PER_TURN_POPULATION_MULTIPLIER,
  MAP_HEIGHT,
  MAP_WIDTH,
  TURNS_PER_DAY,
  END_OF_NIGHT_ENEMY_SPAWNING_BUFFER,
} from "~constants";
import { Pos } from "~types";
import WrappedState from "~types/WrappedState";
import { createEntityFromTemplate } from "~utils/entities";
import { rangeTo } from "~utils/math";
import { choose, pickWeighted } from "~utils/rng";

export default function processWave(state: WrappedState): void {
  if (
    state.select.isNight() &&
    state.select.turnOfDay() <
      TURNS_PER_DAY - END_OF_NIGHT_ENEMY_SPAWNING_BUFFER
  ) {
    let numberOfSpawns =
      ENEMIES_PER_TURN_POPULATION_MULTIPLIER * state.select.population() +
      ENEMIES_PER_TURN_DAY_MULTIPLIER * state.select.day();
    if (Math.floor(numberOfSpawns) !== numberOfSpawns) {
      numberOfSpawns =
        Math.floor(numberOfSpawns) +
        (Math.random() < numberOfSpawns % 1 ? 1 : 0);
    }
    for (const _ of rangeTo(numberOfSpawns)) {
      spawnEnemy(state);
    }
  }
}

function spawnEnemy(state: WrappedState): void {
  const positions = getPossibleSpawnPositions(state);
  if (positions.length) {
    const pos = choose(positions);
    state.act.addEntity(createEntityFromTemplate("ENEMY_DRONE", { pos }));
  } else {
    console.warn("Unable to find spawn position");
  }
}

function getPossibleSpawnPositions(state: WrappedState): Pos[] {
  const unfilteredPositions: Pos[] = [];

  const direction = pickWeighted(
    Object.entries(state.raw.time.directionWeights),
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
    (pos) => !state.select.isPositionBlocked(pos),
  );
}
