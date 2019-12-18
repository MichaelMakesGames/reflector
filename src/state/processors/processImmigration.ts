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
    const player = state.select.player();
    if (!player) {
      console.warn("No player");
    } else {
      const sourcePositions = [player.pos];
      const pos = findNewColonistPosition(state, sourcePositions);
      if (!pos) {
        console.warn("no position for new immigrant found");
      } else {
        state.act.addEntity(createEntityFromTemplate("COLONIST", { pos }));
      }
    }

    state.setRaw({
      ...state.raw,
      turnsUntilNextImmigrant: BASE_IMMIGRATION_RATE,
    });
  }
}

function findNewColonistPosition(
  state: WrappedState,
  sourcePositions: Pos[],
): Pos {
  const positions = sourcePositions
    .reduce<Pos[]>((acc, pos) => {
      acc.push(...getPositionsWithinRange(pos, 3));
      return acc;
    }, [])
    .filter(pos => !state.select.isPositionBlocked(pos))
    .filter(
      pos =>
        pos.x >= 0 && pos.x < MAP_WIDTH && pos.y >= 0 && pos.y < MAP_HEIGHT,
    );
  return choose(positions);
}
