import { GameState, Pos } from "~types";
import {
  ENEMIES_PER_TURN_POPULATION_MULTIPLIER,
  MAP_WIDTH,
  MAP_HEIGHT,
  NIGHT_SPAWN_END_BUFFER,
  TURNS_PER_NIGHT,
  NIGHT_SPAWN_START_BUFFER,
} from "~constants";
import * as selectors from "~state/selectors";
import { rangeTo } from "~utils/math";
import { choose, pickWeighted } from "~utils/rng";
import handleAction from "~state/handleAction";
import { addEntity } from "~state/actions";
import { createEntityFromTemplate } from "~utils/entities";

export default function processWave(oldState: GameState): GameState {
  let state = oldState;
  if (
    state.time.isNight &&
    state.time.turnsUntilChange > NIGHT_SPAWN_END_BUFFER &&
    TURNS_PER_NIGHT - state.time.turnsUntilChange > NIGHT_SPAWN_START_BUFFER
  ) {
    const numberOfSpawns = Math.round(
      ENEMIES_PER_TURN_POPULATION_MULTIPLIER * selectors.population(state),
    );
    for (const _ of rangeTo(numberOfSpawns)) {
      state = spawnEnemy(state);
    }
  }
  return state;
}

function spawnEnemy(state: GameState): GameState {
  const positions = getPossibleSpawnPositions(state);
  if (positions.length) {
    const pos = choose(positions);
    return handleAction(
      state,
      addEntity({ entity: createEntityFromTemplate("ENEMY_DRONE", { pos }) }),
    );
  }

  console.warn("Unable to find spawn position");
  return state;
}

function getPossibleSpawnPositions(state: GameState): Pos[] {
  const unfilteredPositions: Pos[] = [];

  const direction = pickWeighted(Object.entries(state.time.directionWeights));

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
    pos => !selectors.isPositionBlocked(state, pos),
  );
}
