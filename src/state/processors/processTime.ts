import { GameState } from "~types";
import { TURNS_PER_DAY, TURNS_PER_NIGHT } from "~constants";
import { choose } from "~utils/rng";

export default function processTime(state: GameState): GameState {
  if (state.time.turnsUntilChange <= 1) {
    return {
      ...state,
      time: {
        isNight: !state.time.isNight,
        turnsUntilChange: state.time.isNight ? TURNS_PER_DAY : TURNS_PER_NIGHT,
        day: state.time.isNight ? state.time.day + 1 : state.time.day,
        turn: state.time.turn + 1,
        directionWeights: makeRandomDirectionWeights(),
      },
    };
  } else {
    return {
      ...state,
      time: {
        ...state.time,
        turn: state.time.turn + 1,
        turnsUntilChange: state.time.turnsUntilChange - 1,
      },
    };
  }
}

function makeRandomDirectionWeights() {
  const weights = {
    n: 0,
    s: 0,
    e: 0,
    w: 0,
  };
  for (let i = 0; i < 4; i++) {
    const choice: keyof typeof weights = choose(["n", "s", "e", "w"]);
    weights[choice] += 25;
  }
  return weights;
}
