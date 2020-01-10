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

    for (const colonist of state.select.colonists()) {
      cleanEmployment(state, colonist);
    }

    for (const colonist of state.select.colonists()) {
      assignEmployment(state, colonist);
    }

    state.select.colonists().forEach(colonist => {
      if (colonist.colonist.employment) {
        const employment = state.select.entityById(
          colonist.colonist.employment,
        ) as Required<Entity, "pos" | "jobProvider">;
        if (arePositionsEqual(employment.pos, colonist.pos)) {
          doWork(state, colonist);
        } else {
          goToWork(state, colonist);
        }
      } else {
        wander(state, colonist);
      }
    });
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

function cleanEmployment(
  state: WrappedState,
  colonist: Required<Entity, "colonist" | "pos">,
) {
  if (
    colonist.colonist.employment &&
    !state.select.entityById(colonist.colonist.employment)
  ) {
    state.act.updateEntity({
      ...colonist,
      colonist: {
        ...colonist.colonist,
        employment: null,
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

function assignEmployment(
  state: WrappedState,
  colonist: Required<Entity, "colonist" | "pos">,
) {
  if (!colonist.colonist.employment) {
    const availableJobs = state.select
      .entitiesWithComps("jobProvider", "pos")
      .filter(
        e => e.jobProvider.numberEmployed < e.jobProvider.maxNumberEmployed,
      );
    if (availableJobs.length > 0) {
      const job = getClosest(availableJobs, colonist.pos);
      state.act.updateEntity({
        ...job,
        jobProvider: {
          ...job.jobProvider,
          numberEmployed: job.jobProvider.numberEmployed + 1,
        },
      });
      state.act.updateEntity({
        ...colonist,
        colonist: {
          ...colonist.colonist,
          employment: job.id,
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

function goToWork(
  state: WrappedState,
  colonist: Required<Entity, "colonist" | "pos">,
) {
  if (
    colonist.colonist.employment &&
    !arePositionsEqual(colonist.pos, state.select.entityById(
      colonist.colonist.employment,
    ).pos as Pos)
  ) {
    const employment = state.select.entityById(colonist.colonist.employment);
    if (employment.pos) {
      const direction = getDirectionTowardTarget(
        colonist.pos,
        employment.pos,
        state,
      );
      if (direction) {
        state.act.move({ entityId: colonist.id, ...direction });
      }
    }
  }
}

function doWork(
  state: WrappedState,
  colonist: Required<Entity, "colonist" | "pos">,
) {
  const employment = state.select.entityById(colonist.colonist
    .employment as string) as Required<Entity, "jobProvider">;
  if (
    Object.entries(employment.jobProvider.consumes)
      .filter((entry): entry is [Resource, number] => Boolean(entry[1]))
      .every(([resource, cost]) => state.select.canAffordToPay(resource, cost))
  ) {
    Object.entries(employment.jobProvider.consumes)
      .filter((entry): entry is [Resource, number] => Boolean(entry[1]))
      .every(([resource, cost]) =>
        state.act.modifyResource({ resource, amount: -cost }),
      );
    Object.entries(employment.jobProvider.produces)
      .filter((entry): entry is [Resource, number] => Boolean(entry[1]))
      .every(([resource, amount]) =>
        state.act.modifyResource({ resource, amount }),
      );
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
