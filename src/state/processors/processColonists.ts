import { Required } from "Object/_api";
import { PRIORITY_MARKER, PRIORITY_UNIT, TURNS_PER_NIGHT } from "~constants";
import { ResourceCode } from "~data/resources";
import { Entity, HasJobProvider, HasPos, Pos } from "~types";
import WrappedState from "~types/WrappedState";
import { getDirectionTowardTarget } from "~utils/ai";
import { createEntityFromTemplate } from "~utils/entities";
import {
  arePositionsEqual,
  getAdjacentPositions,
  getClosest,
} from "~utils/geometry";
import { rangeTo } from "~utils/math";
import { choose } from "~utils/rng";
import { ColonistStatusCode } from "~data/colonistStatuses";

export default function processColonists(state: WrappedState): void {
  if (!state.select.isNight() || state.select.turnOfNight() === 0) {
    for (const colonist of state.select.colonists()) {
      clearResidence(state, colonist);
    }

    for (const colonist of state.select.colonists().sort((a, b) => {
      const aEmployment = state.select.employment(a);
      const bEmployment = state.select.employment(b);
      const aPriority = aEmployment
        ? state.select.jobPriority(aEmployment.jobProvider.jobType)
        : Infinity;
      const bPriority = bEmployment
        ? state.select.jobPriority(bEmployment.jobProvider.jobType)
        : Infinity;
      return aPriority - bPriority;
    })) {
      assignResidence(state, colonist);
    }
  }

  if (state.select.isNight()) {
    for (const colonist of state.select.colonists()) {
      if (colonist.colonist.residence) {
        goHomeOrSleep(state, colonist);
      } else if (state.select.isPositionBlocked(colonist.pos)) {
        wander(state, colonist);
      } else {
        pitchTent(state, colonist);
      }
    }
  } else {
    state.select
      .entitiesWithComps("housing")
      .filter((entity) => entity.housing.removeOnVacancy)
      .forEach((tent) => state.act.removeEntity(tent.id));

    for (const colonist of state.select.colonists()) {
      cleanEmployment(state, colonist);
    }

    const jobDisablers = state.select.jobDisablers();
    const workPlaces = state.select
      .entitiesWithComps("pos", "jobProvider")
      .filter(
        (e) =>
          !jobDisablers.some((disabler) =>
            arePositionsEqual(e.pos, disabler.pos),
          ),
      )
      .sort(
        (a, b) =>
          state.select.jobPriority(a.jobProvider.jobType) -
          state.select.jobPriority(b.jobProvider.jobType),
      );
    for (let workPlace of workPlaces) {
      workPlace = state.select.entityById(workPlace.id) as typeof workPlace;
      const numEmptyJobs =
        workPlace.jobProvider.maxNumberEmployed -
        workPlace.jobProvider.numberEmployed;
      if (numEmptyJobs > 0) {
        for (const _ of rangeTo(numEmptyJobs)) {
          assignColonistToWorkPlace(state, workPlace);
        }
      }
    }

    state.select.colonists().forEach((colonist) => {
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
    .forEach((colonist) => updateColonistTile(state, colonist));
}

function clearResidence(
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

    const residence = state.select.entityById(colonist.colonist.residence);
    if (residence && residence.housing) {
      state.act.updateEntity({
        ...residence,
        housing: {
          ...residence.housing,
          occupancy: residence.housing.occupancy - 1,
        },
      });
    }
  }
}

function cleanEmployment(
  state: WrappedState,
  colonist: Required<Entity, "colonist" | "pos">,
) {
  if (colonist.colonist.employment) {
    const employment = state.select.employment(colonist);
    if (employment) {
      const jobDisablers = state.select.jobDisablers();
      if (
        jobDisablers.some((disabler) =>
          arePositionsEqual(disabler.pos, employment.pos),
        )
      ) {
        state.act.updateEntity({
          ...colonist,
          colonist: {
            ...colonist.colonist,
            employment: null,
          },
        });
        state.act.updateEntity({
          ...employment,
          jobProvider: {
            ...employment.jobProvider,
            numberEmployed: employment.jobProvider.numberEmployed - 1,
          },
        });
      }
    } else {
      state.act.updateEntity({
        ...colonist,
        colonist: {
          ...colonist.colonist,
          employment: null,
        },
      });
    }
  }
}

function assignResidence(
  state: WrappedState,
  colonist: Required<Entity, "colonist" | "pos">,
) {
  if (!colonist.colonist.residence) {
    const availableResidences = state.select
      .entitiesWithComps("housing", "pos")
      .filter((e) => e.housing.occupancy < e.housing.capacity);
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

function goHomeOrSleep(
  state: WrappedState,
  colonist: Required<Entity, "colonist" | "pos">,
) {
  if (colonist.colonist.residence) {
    if (
      arePositionsEqual(
        colonist.pos,
        state.select.entityById(colonist.colonist.residence).pos as Pos,
      )
    ) {
      state.act.updateEntity({
        ...colonist,
        colonist: { ...colonist.colonist, status: ColonistStatusCode.Sleeping },
      });
      return;
    }
    const residence = state.select.entityById(colonist.colonist.residence);
    if (residence.pos) {
      const direction = getDirectionTowardTarget(
        colonist.pos,
        residence.pos,
        state,
      );
      if (direction) {
        state.act.move({ entityId: colonist.id, ...direction });
        state.act.updateEntity({
          ...state.select.entityById(colonist.id),
          colonist: {
            ...colonist.colonist,
            status: ColonistStatusCode.GoingHome,
          },
        });
        return;
      }
    }
  }
  state.act.updateEntity({
    ...colonist,
    colonist: {
      ...colonist.colonist,
      status: ColonistStatusCode.CannotFindPathHome,
    },
  });
}

function goToWork(
  state: WrappedState,
  colonist: Required<Entity, "colonist" | "pos">,
) {
  if (
    colonist.colonist.employment &&
    !arePositionsEqual(
      colonist.pos,
      state.select.entityById(colonist.colonist.employment).pos as Pos,
    )
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
        state.act.updateEntity({
          ...state.select.entityById(colonist.id),
          colonist: {
            ...colonist.colonist,
            status: ColonistStatusCode.GoingToWork,
          },
        });
        return;
      }
    }
  }
  state.act.updateEntity({
    ...colonist,
    colonist: {
      ...colonist.colonist,
      status: ColonistStatusCode.CannotFindPathToWork,
    },
  });
}

function doWork(
  state: WrappedState,
  colonist: Required<Entity, "colonist" | "pos">,
) {
  const employment = state.select.entityById(
    colonist.colonist.employment as string,
  ) as Required<Entity, "jobProvider">;
  if (
    Object.entries(employment.jobProvider.consumes)
      .filter((entry): entry is [ResourceCode, number] => Boolean(entry[1]))
      .every(([resource, cost]) => state.select.canAffordToPay(resource, cost))
  ) {
    Object.entries(employment.jobProvider.consumes)
      .filter((entry): entry is [ResourceCode, number] => Boolean(entry[1]))
      .every(([resource, cost]) =>
        state.act.modifyResource({
          resource,
          amount: -cost,
          reason: employment.jobProvider.resourceChangeReason,
        }),
      );
    Object.entries(employment.jobProvider.produces)
      .filter((entry): entry is [ResourceCode, number] => Boolean(entry[1]))
      .every(([resource, amount]) =>
        state.act.modifyResource({
          resource,
          amount,
          reason: employment.jobProvider.resourceChangeReason,
        }),
      );
    state.act.updateEntity({
      ...colonist,
      colonist: { ...colonist.colonist, status: ColonistStatusCode.Working },
    });
  } else {
    state.act.updateEntity({
      ...colonist,
      colonist: {
        ...colonist.colonist,
        status: ColonistStatusCode.MissingResources,
      },
    });
  }
}

function wander(
  state: WrappedState,
  colonist: Required<Entity, "colonist" | "pos">,
) {
  const newPosOptions = getAdjacentPositions(colonist.pos).filter(
    (pos) => !state.select.isPositionBlocked(pos),
  );
  if (newPosOptions.length >= 1) {
    const newPos = choose(newPosOptions);
    state.act.updateEntity({
      ...colonist,
      pos: newPos,
    });
  }
  state.act.updateEntity({
    ...state.select.entityById(colonist.id),
    colonist: {
      ...colonist.colonist,
      status: ColonistStatusCode.Wandering,
    },
  });
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
      status: ColonistStatusCode.Sleeping,
    },
  });
}

function updateColonistTile(
  state: WrappedState,
  colonist: Required<Entity, "colonist" | "pos" | "display">,
) {
  const numColonistsAtPos = state.select
    .entitiesAtPosition(colonist.pos)
    .filter((e) => e.colonist).length;

  const residence = state.select.residence(colonist);
  if (residence && arePositionsEqual(residence.pos, colonist.pos)) {
    const tile = `colonists_${numColonistsAtPos}_${residence.template.toLowerCase()}`;
    state.act.updateEntity({
      ...colonist,
      display: {
        ...colonist.display,
        tile,
        priority: PRIORITY_MARKER,
      },
    });
  } else if (numColonistsAtPos === 1) {
    state.act.updateEntity({
      ...colonist,
      display: {
        ...colonist.display,
        tile: "colonists1",
        priority: PRIORITY_UNIT,
      },
    });
  } else if (numColonistsAtPos === 2) {
    state.act.updateEntity({
      ...colonist,
      display: {
        ...colonist.display,
        tile: "colonists2",
        priority: PRIORITY_UNIT,
      },
    });
  } else {
    state.act.updateEntity({
      ...colonist,
      display: {
        ...colonist.display,
        tile: "colonists3",
        priority: PRIORITY_UNIT,
      },
    });
  }
}

function groupColonistsByJobPriority(
  state: WrappedState,
): Record<number, Required<Entity, "colonist" | "pos" | "display">[]> {
  const results: Record<
    number,
    Required<Entity, "colonist" | "pos" | "display">[]
  > = {};
  state.select.colonists().forEach((colonist) => {
    let priority = Infinity;
    const employment = state.select.employment(colonist);
    if (employment && employment.jobProvider) {
      priority = state.select.jobPriority(employment.jobProvider.jobType);
    }
    if (!results[priority]) results[priority] = [];
    results[priority].push(colonist);
  });
  return results;
}

function findColonistsWithLowestPriorityJob(
  state: WrappedState,
  maximumPriority: number,
): null | Required<Entity, "colonist" | "pos" | "display">[] {
  const colonistsByJobPriority = groupColonistsByJobPriority(state);
  const lowestPriority = Math.max(
    ...Object.keys(colonistsByJobPriority).map(parseFloat),
  );
  if (lowestPriority > maximumPriority) {
    return colonistsByJobPriority[lowestPriority];
  } else {
    return null;
  }
}

function assignColonistToWorkPlace(
  state: WrappedState,
  workPlace: Entity & HasPos & HasJobProvider,
) {
  const workPlaceCopy = state.select.entityById(
    workPlace.id,
  ) as typeof workPlace;

  const colonists = findColonistsWithLowestPriorityJob(
    state,
    state.select.jobPriority(workPlaceCopy.jobProvider.jobType),
  );
  if (colonists) {
    const colonist = getClosest(colonists, workPlaceCopy.pos);
    const oldEmployment = state.select.employment(colonist);
    if (oldEmployment) {
      state.act.updateEntity({
        ...oldEmployment,
        jobProvider: {
          ...oldEmployment.jobProvider,
          numberEmployed: oldEmployment.jobProvider.numberEmployed - 1,
        },
      });
    }
    state.act.updateEntity({
      ...workPlaceCopy,
      jobProvider: {
        ...workPlaceCopy.jobProvider,
        numberEmployed: workPlaceCopy.jobProvider.numberEmployed + 1,
      },
    });
    state.act.updateEntity({
      ...colonist,
      colonist: {
        ...colonist.colonist,
        employment: workPlaceCopy.id,
      },
    });
  }
}
