import { Required } from "Object/_api";
import { Entity, Pos } from "~/types";
import { BASE_IMMIGRATION_RATE, MAP_HEIGHT, MAP_WIDTH } from "~constants";
import WrappedState from "~types/WrappedState";
import { createEntityFromTemplate } from "~utils/entities";
import { getPositionsWithinRange } from "~utils/geometry";
import { choose } from "~utils/rng";

export default function processImmigration(state: WrappedState): void {
  state.setRaw({
    ...state.raw,
    turnsUntilNextImmigrant: state.raw.turnsUntilNextImmigrant - 1,
  });

  if (state.raw.turnsUntilNextImmigrant <= 0) {
    const houses = state.select.entitiesWithComps("housing", "pos");

    const pos = findNewTentPosition(state, houses);
    if (!pos) {
      console.warn("no position for new immigrant found");
    } else {
      state.act.addEntity(createEntityFromTemplate("TENT", { pos }));
    }

    state.setRaw({
      ...state.raw,
      turnsUntilNextImmigrant: BASE_IMMIGRATION_RATE,
    });
  }
}

function findNewTentPosition(
  state: WrappedState,
  houses: Required<Entity, "housing" | "pos">[],
): Pos {
  const positions = houses
    .reduce<Pos[]>((acc, house) => {
      acc.push(...getPositionsWithinRange(house.pos, 3));
      return acc;
    }, [])
    .filter(pos => !state.select.isPositionBlocked(pos))
    .filter(
      pos =>
        pos.x >= 0 && pos.x < MAP_WIDTH && pos.y >= 0 && pos.y < MAP_HEIGHT,
    );
  return choose(positions);
}
