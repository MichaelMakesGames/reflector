import { Pos } from "~/types";
import {
  BASE_IMMIGRATION_RATE,
  NEW_COLONISTS_PER_DAY,
  MAP_HEIGHT,
  MAP_WIDTH,
} from "~constants";
import WrappedState from "~types/WrappedState";
import { createEntityFromTemplate } from "~lib/entities";
import { getPositionsWithinRange } from "~lib/geometry";
import { rangeTo } from "~lib/math";
import { choose } from "~lib/rng";

export default function immigrationSystem(state: WrappedState): void {
  if (state.select.isLastTurnOfNight()) {
    const player = state.select.player();
    if (!player) {
      console.warn("No player");
    } else {
      const sourcePositions = [player.pos];
      for (const _ of rangeTo(NEW_COLONISTS_PER_DAY)) {
        const pos = findNewColonistPosition(state, sourcePositions);
        if (!pos) {
          console.warn("no position for new immigrant found");
        } else {
          state.act.addEntity(createEntityFromTemplate("COLONIST", { pos }));
        }
      }
      state.act.logMessage({
        message: `${NEW_COLONISTS_PER_DAY} new colonists have arrived!`,
        type: "success",
      });
    }
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
    .filter((pos) => !state.select.isPositionBlocked(pos))
    .filter(
      (pos) =>
        pos.x >= 0 && pos.x < MAP_WIDTH && pos.y >= 0 && pos.y < MAP_HEIGHT,
    );
  return choose(positions);
}
