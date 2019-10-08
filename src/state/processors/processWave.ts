import { GameState, Pos } from "~types";
import {
  WAVE_DURATION_BASE,
  ENEMIES_PER_WAVE_POPULATION_MULTIPLIER,
  UP,
  MAP_WIDTH,
  MAP_HEIGHT,
  DOWN,
  LEFT,
  RIGHT,
  TURNS_BETWEEN_WAVES_BASE,
} from "~constants";
import * as selectors from "~state/selectors";
import { rangeTo } from "~utils/math";
import { choose } from "~utils/rng";
import handleAction from "~state/handleAction";
import { addEntity } from "~state/actions";
import { createEntityFromTemplate } from "~utils/entities";
import { getConstDir } from "~utils/geometry";

export default function processWave(oldState: GameState): GameState {
  let state = oldState;
  const isCurrent = state.wave.turnsUntilNextWaveStart === 0;
  if (isCurrent) {
    const numberOfSpawns = Math.round(
      ENEMIES_PER_WAVE_POPULATION_MULTIPLIER * selectors.population(state),
    );
    for (const _ of rangeTo(numberOfSpawns)) {
      state = spawnEnemy(state);
    }
    state = {
      ...state,
      wave: {
        ...state.wave,
        turnsUntilCurrentWaveEnd: state.wave.turnsUntilCurrentWaveEnd - 1,
      },
    };
    if (state.wave.turnsUntilCurrentWaveEnd <= 0) {
      state.wave.turnsUntilNextWaveStart = TURNS_BETWEEN_WAVES_BASE;
    }
  } else {
    state = {
      ...state,
      wave: {
        ...state.wave,
        turnsUntilNextWaveStart: state.wave.turnsUntilNextWaveStart - 1,
      },
    };
    if (state.wave.turnsUntilNextWaveStart === 0) {
      state = {
        ...state,
        wave: {
          ...state.wave,
          turnsUntilCurrentWaveEnd: WAVE_DURATION_BASE,
          direction: choose([UP, DOWN, LEFT, RIGHT]),
        },
      };
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
  const direction = getConstDir(state.wave.direction);

  if (direction === UP) {
    for (const x of rangeTo(MAP_WIDTH)) {
      const y = 0;
      unfilteredPositions.push({ x, y });
    }
  }

  if (direction === DOWN) {
    for (const x of rangeTo(MAP_WIDTH)) {
      const y = MAP_HEIGHT - 1;
      unfilteredPositions.push({ x, y });
    }
  }

  if (direction === LEFT) {
    for (const y of rangeTo(MAP_HEIGHT)) {
      const x = 0;
      unfilteredPositions.push({ x, y });
    }
  }

  if (direction === RIGHT) {
    for (const y of rangeTo(MAP_HEIGHT)) {
      const x = MAP_WIDTH - 1;
      unfilteredPositions.push({ x, y });
    }
  }

  return unfilteredPositions.filter(
    pos => !selectors.isPositionBlocked(state, pos),
  );
}
