import { Required } from "Object/_api";
import { Entity, Pos } from "~types";
import WrappedState from "~types/WrappedState";
import { getDirectionTowardTarget } from "~utils/ai";
import { createEntityFromTemplate } from "~utils/entities";
import {
  arePositionsEqual,
  getAdjacentPositions,
  getClosest,
} from "~utils/geometry";
import { choose } from "~utils/rng";

export default function processColonists(state: WrappedState): void {
  if (state.select.isNight()) {
    for (const colonist of state.select.colonists()) {
      cleanResidence(state, colonist);
    }

    for (const colonist of state.select.colonists()) {
      assignResidence(state, colonist);
    }

    for (const colonist of state.select.colonists()) {
      if (colonist.colonist.residence) {
        goHome(state, colonist);
      } else if (state.select.isPositionBlocked(colonist.pos)) {
        wander(state, colonist);
      } else {
        pitchTent(state, colonist);
      }
    }
  } else {
    state.select
      .entitiesWithComps("housing")
      .filter(entity => entity.housing.removeOnVacancy)
      .forEach(tent => state.act.removeEntity(tent.id));
    state.select.colonists().forEach(colonist => wander(state, colonist));
  }

  // update tile
  state.select
    .entitiesWithComps("colonist", "display", "pos")
    .forEach(colonist => updateColonistTile(state, colonist));
}

function cleanResidence(
  state: WrappedState,
  colonist: Required<Entity, "colonist" | "pos">,
) {
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

function assignResidence(
  state: WrappedState,
  colonist: Required<Entity, "colonist" | "pos">,
) {
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

function goHome(
  state: WrappedState,
  colonist: Required<Entity, "colonist" | "pos">,
) {
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

function wander(
  state: WrappedState,
  colonist: Required<Entity, "colonist" | "pos">,
) {
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
}

function pitchTent(
  state: WrappedState,
  colonist: Required<Entity, "colonist" | "pos">,
) {
  const tent = createEntityFromTemplate("TENT", { pos: colonist.pos });
  state.act.addEntity(tent);
  state.act.updateEntity({
    ...colonist,
    colonist: {
      ...colonist.colonist,
      residence: tent.id,
    },
  });
}

function updateColonistTile(
  state: WrappedState,
  colonist: Required<Entity, "colonist" | "pos" | "display">,
) {
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
}
