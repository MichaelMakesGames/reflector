import WrappedState from "~types/WrappedState";
import { getAdjacentPositions } from "~utils/geometry";
import { choose } from "~utils/rng";

export default function processColonists(state: WrappedState): void {
  // wander
  state.select.entitiesWithComps("colonist", "pos").forEach(colonist => {
    const newPosOptions = getAdjacentPositions(colonist.pos).filter(
      pos => !state.select.isPositionBlocked(pos),
    );
    if (newPosOptions.length >= 1) {
      const newPos = choose(newPosOptions);
      state.act.updateEntity({
        ...colonist,
        pos: newPos,
      });
    }
  });

  // update tile
  state.select
    .entitiesWithComps("colonist", "display", "pos")
    .forEach(colonist => {
      const numColonistsAtPos = state.select
        .entitiesAtPosition(colonist.pos)
        .filter(e => e.colonist).length;
      if (numColonistsAtPos === 1) {
        state.act.updateEntity({
          ...colonist,
          display: {
            ...colonist.display,
            tile: "colonists1",
          },
        });
      } else if (numColonistsAtPos === 2) {
        state.act.updateEntity({
          ...colonist,
          display: {
            ...colonist.display,
            tile: "colonists2",
          },
        });
      } else {
        state.act.updateEntity({
          ...colonist,
          display: {
            ...colonist.display,
            tile: "colonists3",
          },
        });
      }
    });
}
