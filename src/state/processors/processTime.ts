import { TURNS_PER_DAY, TURNS_PER_NIGHT } from "~constants";
import WrappedState from "~types/WrappedState";
import { choose } from "~utils/rng";

export default function processTime(state: WrappedState): void {
  if (state.raw.time.turnsUntilChange <= 1) {
    state.setRaw({
      ...state.raw,
      time: {
        isNight: !state.raw.time.isNight,
        turnsUntilChange: state.raw.time.isNight
          ? TURNS_PER_DAY
          : TURNS_PER_NIGHT,
        day: state.raw.time.isNight
          ? state.raw.time.day + 1
          : state.raw.time.day,
        turn: state.raw.time.turn + 1,
        directionWeights: makeRandomDirectionWeights(),
      },
    });
  } else {
    state.setRaw({
      ...state.raw,
      time: {
        ...state.raw.time,
        turn: state.raw.time.turn + 1,
        turnsUntilChange: state.raw.time.turnsUntilChange - 1,
      },
    });
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
