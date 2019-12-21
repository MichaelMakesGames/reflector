import { Pos } from "~types";
import WrappedState from "~types/WrappedState";
import {
  arePositionsEqual,
  getAdjacentPositions,
  getClosest,
} from "~utils/geometry";
import { choose } from "~utils/rng";
import { getDirectionTowardTarget } from "~utils/ai";

export default function processColonists(state: WrappedState): void {
  if (state.select.isNight()) {
    // remove residence assignments from colonists if residence no longer exists
    for (const colonist of state.select.colonists()) {
      if (
        colonist.colonist.residence &&
        !state.select.entityById(colonist.colonist.residence)
      ) {
        state.act.updateEntity({
          ...colonist,
          colonist: {
            ...colonist.colonist,
            residence: null,
          },
        });
      }
    }

    // try to find residences for colonists without one
    for (const colonist of state.select.colonists()) {
      if (!colonist.colonist.residence) {
        const availableResidences = state.select
          .entitiesWithComps("housing", "pos")
          .filter(e => e.housing.occupancy < e.housing.capacity);
        if (availableResidences.length > 0) {
          const residence = getClosest(availableResidences, colonist.pos);
          state.act.updateEntity({
            ...residence,
            housing: {
              ...residence.housing,
              occupancy: residence.housing.occupancy + 1,
            },
          });
          state.act.updateEntity({
            ...colonist,
            colonist: {
              ...colonist.colonist,
              residence: residence.id,
            },
          });
        }
      }
    }

    // move colonists to residences
    for (const colonist of state.select.colonists()) {
      if (
        colonist.colonist.residence &&
        !arePositionsEqual(colonist.pos, state.select.entityById(
          colonist.colonist.residence,
        ).pos as Pos)
      ) {
        const residence = state.select.entityById(colonist.colonist.residence);
        if (residence.pos) {
          const direction = getDirectionTowardTarget(
            colonist.pos,
            residence.pos,
            state,
          );
          if (direction) {
            state.act.move({ entityId: colonist.id, ...direction });
          }
        }
      }
    }
  } else {
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
  }

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
