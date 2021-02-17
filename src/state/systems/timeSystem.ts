import { TURNS_PER_DAY, TURNS_PER_NIGHT } from "~constants";
import WrappedState from "~types/WrappedState";
import { choose } from "~lib/rng";
import renderer from "~renderer";
import colors from "~colors";

export default function timeSystem(state: WrappedState): void {
  state.setRaw({
    ...state.raw,
    time: {
      ...state.raw.time,
      turn: state.raw.time.turn + 1,
    },
  });
  if (state.select.turnOfDay() === 1) {
    state.setRaw({
      ...state.raw,
      time: {
        ...state.raw.time,
        directionWeights: makeRandomDirectionWeights(),
      },
    });
    renderer.setBackgroundColor(colors.backgroundDay);
  }

  if (state.select.turnOfNight() === 1) {
    renderer.setBackgroundColor(colors.backgroundNight);
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
