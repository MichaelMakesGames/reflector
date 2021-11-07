import { Required } from "ts-toolbelt/out/Object/Required";
import { PRIORITY_BUILDING_HIGH_DETAIL, PRIORITY_UNIT } from "../../constants";
import { ColonistStatusCode } from "../../data/colonistStatuses";
import { executeEffect } from "../../data/effects";
import resources, { ResourceCode } from "../../data/resources";
import { getDirectionTowardTarget } from "../../lib/ai";
import {
  arePositionsEqual,
  getAdjacentPositions,
  getClosest,
  getDistance,
} from "../../lib/geometry";
import { rangeTo } from "../../lib/math";
import { choose } from "../../lib/rng";
import renderer from "../../renderer";
import { Entity, JobProvider, Pos } from "../../types";
import WrappedState from "../../types/WrappedState";

export default function colonistsSystem(state: WrappedState): void {
  if (!state.select.isNight() || state.select.isFirstTurnOfNight()) {
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

  if (
    state.select.turnOfNight() === 0 &&
    state.select.population() > state.select.housingCapacity()
  ) {
    state.act.logMessage({
      message:
        "You do not have enough housing. Build some tents or residences for your colonists to sleep in.",
    });
  }

  if (state.select.isNight() && !state.select.isLastTurnOfNight()) {
    doResidenceSanityCheck(state);
    checkForEmptyHomesAndHomelessColonists(state);
    for (const colonist of state.select.colonists()) {
      if (colonist.colonist.residence) {
        goHomeOrSleep(state, colonist);
      } else {
        wander(state, colonist);
      }
    }
  } else {
    for (const colonist of state.select.colonists()) {
      cleanEmployment(state, colonist);
    }

    const jobDisablers = state.select.jobDisablers();
    const workPlaces = state.select
      .entitiesWithComps("pos", "jobProvider")
      .filter(
        (e) =>
          !jobDisablers.some((disabler) =>
            arePositionsEqual(e.pos, disabler.pos)
          )
      )
      .sort(
        (a, b) =>
          state.select.jobPriority(a.jobProvider.jobType) -
          state.select.jobPriority(b.jobProvider.jobType)
      );
    for (let workPlace of workPlaces) {
      workPlace = state.select.entityById(workPlace.id) as typeof workPlace;
      const numEmptyJobs =
        workPlace.jobProvider.maxNumberEmployed -
        workPlace.jobProvider.numberEmployed;
      if (numEmptyJobs > 0) {
        rangeTo(numEmptyJobs).forEach(() => {
          assignColonistToWorkPlace(state, workPlace);
        });
      }
    }

    state.select.colonists().forEach((colonist) => {
      if (colonist.colonist.employment) {
        const employment = state.select.entityById(
          colonist.colonist.employment
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
}

function clearResidence(
  state: WrappedState,
  colonist: Required<Entity, "colonist" | "pos">
) {
  if (
    colonist.colonist.residence &&
    !state.select.entityById(colonist.colonist.residence)
  ) {
    state.act.updateEntity({
      id: colonist.id,
      colonist: {
        ...colonist.colonist,
        residence: null,
      },
    });

    const residence = state.select.entityById(colonist.colonist.residence);
    if (residence && residence.housing) {
      state.act.updateEntity({
        id: residence.id,
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
  colonist: Required<Entity, "colonist" | "pos">
) {
  if (colonist.colonist.employment) {
    const employment = state.select.employment(colonist);
    if (employment) {
      const jobDisablers = state.select.jobDisablers();
      if (
        jobDisablers.some((disabler) =>
          arePositionsEqual(disabler.pos, employment.pos)
        )
      ) {
        state.act.updateEntity({
          id: colonist.id,
          colonist: {
            ...colonist.colonist,
            employment: null,
          },
        });
        state.act.updateEntity({
          id: employment.id,
          jobProvider: {
            ...employment.jobProvider,
            numberEmployed: employment.jobProvider.numberEmployed - 1,
          },
        });
      }
    } else {
      state.act.updateEntity({
        id: colonist.id,
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
  colonist: Required<Entity, "colonist" | "pos">
) {
  if (!colonist.colonist.residence) {
    const availableResidences = state.select
      .entitiesWithComps("housing", "pos")
      .filter((e) => e.housing.occupancy < e.housing.capacity);
    if (availableResidences.length > 0) {
      const residence = getClosest(availableResidences, colonist.pos);
      state.act.updateEntity({
        id: residence.id,
        housing: {
          ...residence.housing,
          occupancy: residence.housing.occupancy + 1,
        },
      });
      state.act.updateEntity({
        id: colonist.id,
        colonist: {
          ...colonist.colonist,
          residence: residence.id,
        },
      });
    }
  }
}

function tryToMove(
  state: WrappedState,
  colonist: Required<Entity, "colonist" | "pos">,
  pos: Pos
): boolean {
  const direction = getDirectionTowardTarget(
    colonist.pos,
    pos,
    colonist,
    state
  );
  if (direction) {
    state.act.move({ entityId: colonist.id, ...direction });
    const updatedColonist = state.select.entityById(
      colonist.id
    ) as typeof colonist;
    if (state.select.hasRoad(updatedColonist.pos)) {
      const secondDirection = getDirectionTowardTarget(
        updatedColonist.pos,
        pos,
        colonist,
        state
      );
      if (secondDirection)
        state.act.move({ entityId: colonist.id, ...secondDirection });
    }
    return true;
  }
  return false;
}

function goHomeOrSleep(
  state: WrappedState,
  colonist: Required<Entity, "colonist" | "pos">
) {
  if (colonist.colonist.residence) {
    if (
      arePositionsEqual(
        colonist.pos,
        state.select.entityById(colonist.colonist.residence).pos as Pos
      )
    ) {
      state.act.updateEntity({
        id: colonist.id,
        colonist: { ...colonist.colonist, status: ColonistStatusCode.Sleeping },
      });
      return;
    }
    const residence = state.select.entityById(colonist.colonist.residence);
    if (residence.pos) {
      const didMove = tryToMove(state, colonist, residence.pos);
      state.act.updateEntity({
        id: colonist.id,
        colonist: {
          ...colonist.colonist,
          status: didMove
            ? ColonistStatusCode.GoingHome
            : ColonistStatusCode.CannotFindPathHome,
        },
      });
    }
  }
  state.act.updateEntity({
    id: colonist.id,
    colonist: {
      ...colonist.colonist,
      status: ColonistStatusCode.CannotFindPathHome,
    },
  });
}

function goToWork(
  state: WrappedState,
  colonist: Required<Entity, "colonist" | "pos">
) {
  if (
    colonist.colonist.employment &&
    !arePositionsEqual(
      colonist.pos,
      state.select.entityById(colonist.colonist.employment).pos as Pos
    )
  ) {
    const employment = state.select.entityById(colonist.colonist.employment);
    if (employment.pos) {
      const didMove = tryToMove(state, colonist, employment.pos);
      state.act.updateEntity({
        id: colonist.id,
        colonist: {
          ...colonist.colonist,
          status: didMove
            ? ColonistStatusCode.GoingToWork
            : ColonistStatusCode.CannotFindPathToWork,
        },
      });
    }
  }
  state.act.updateEntity({
    id: colonist.id,
    colonist: {
      ...colonist.colonist,
      status: ColonistStatusCode.CannotFindPathToWork,
    },
  });
}

function doWork(
  state: WrappedState,
  colonist: Required<Entity, "colonist" | "pos">
) {
  const employment = state.select.entityById(
    colonist.colonist.employment as string
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
        })
      );

    const updatedJobProvider: JobProvider = { ...employment.jobProvider };
    updatedJobProvider.workContributed += 1;
    if (updatedJobProvider.workContributed >= updatedJobProvider.workRequired) {
      updatedJobProvider.workContributed -= updatedJobProvider.workRequired;
      Object.entries(employment.jobProvider.produces)
        .filter((entry): entry is [ResourceCode, number] => Boolean(entry[1]))
        .forEach(([resourceCode, amount]) => {
          state.act.modifyResource({
            resource: resourceCode,
            amount,
            reason: employment.jobProvider.resourceChangeReason,
          });
          const resource = resources[resourceCode];
          renderer.flashTile(colonist.pos, resource.icon, resource.color);
        });
    }
    state.act.updateEntity({
      id: employment.id,
      jobProvider: updatedJobProvider,
    });

    executeEffect(
      updatedJobProvider.onWorked,
      state,
      state.select.entityById(colonist.id),
      state.select.entityById(employment.id)
    );

    state.act.updateEntity({
      id: colonist.id,
      colonist: { ...colonist.colonist, status: ColonistStatusCode.Working },
    });
  } else {
    const missingResources: ResourceCode[] = Object.entries(
      employment.jobProvider.consumes
    )
      .filter((entry): entry is [ResourceCode, number] => Boolean(entry[1]))
      .filter(
        ([resource, cost]) => !state.select.canAffordToPay(resource, cost)
      )
      .map(([resource, _]) => resource);
    state.act.updateEntity({
      id: colonist.id,
      colonist: {
        ...colonist.colonist,
        status: ColonistStatusCode.MissingResources,
        missingResources,
      },
    });
  }
}

function wander(
  state: WrappedState,
  colonist: Required<Entity, "colonist" | "pos">
) {
  const newPosOptions = getAdjacentPositions(colonist.pos, true).filter(
    (pos) => !state.select.isPositionBlocked(pos)
  );
  if (newPosOptions.length >= 1) {
    const newPos = choose(newPosOptions);
    state.act.move({
      entityId: colonist.id,
      dx: newPos.x - colonist.pos.x,
      dy: newPos.y - colonist.pos.y,
    });
  }
  state.act.updateEntity({
    id: colonist.id,
    colonist: {
      ...colonist.colonist,
      status: ColonistStatusCode.Wandering,
    },
  });
}

function groupColonistsByJobPriority(
  state: WrappedState
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
  maximumPriority: number
): null | Required<Entity, "colonist" | "pos" | "display">[] {
  const colonistsByJobPriority = groupColonistsByJobPriority(state);
  const lowestPriority = Math.max(
    ...Object.keys(colonistsByJobPriority).map(parseFloat)
  );
  if (lowestPriority > maximumPriority) {
    return colonistsByJobPriority[lowestPriority];
  } else {
    return null;
  }
}

function assignColonistToWorkPlace(
  state: WrappedState,
  workPlace: Required<Entity, "pos" | "jobProvider">
) {
  const workPlaceCopy = state.select.entityById(
    workPlace.id
  ) as typeof workPlace;

  const colonists = findColonistsWithLowestPriorityJob(
    state,
    state.select.jobPriority(workPlaceCopy.jobProvider.jobType)
  );
  if (colonists) {
    const colonist = getClosest(colonists, workPlaceCopy.pos);
    const oldEmployment = state.select.employment(colonist);
    if (oldEmployment) {
      state.act.updateEntity({
        id: oldEmployment.id,
        jobProvider: {
          ...oldEmployment.jobProvider,
          numberEmployed: oldEmployment.jobProvider.numberEmployed - 1,
        },
      });
    }
    state.act.updateEntity({
      id: workPlaceCopy.id,
      jobProvider: {
        ...workPlaceCopy.jobProvider,
        numberEmployed: workPlaceCopy.jobProvider.numberEmployed + 1,
      },
    });
    state.act.updateEntity({
      id: colonist.id,
      colonist: {
        ...colonist.colonist,
        employment: workPlaceCopy.id,
      },
    });
  }
}

// clear any invalid residence assignment
function doResidenceSanityCheck(state: WrappedState) {
  for (const colonist of state.select.colonists()) {
    if (colonist.colonist.residence) {
      const residence = state.select.residence(colonist);
      if (!residence) {
        state.act.updateEntity({
          id: colonist.id,
          colonist: {
            ...colonist.colonist,
            residence: null,
          },
        });
      }
    }
  }

  for (const residence of state.select.entitiesWithComps("pos", "housing")) {
    const residents = state.select.residents(residence);
    if (residence.housing.occupancy !== residents.length) {
      state.act.updateEntity({
        id: residence.id,
        housing: {
          ...residence.housing,
          occupancy: residents.length,
        },
      });
    }
  }
}

function checkForEmptyHomesAndHomelessColonists(state: WrappedState) {
  let residencesUnderCapacity = state.select.residencesUnderCapacity();
  let homelessColonists = state.select.homelessColonists();

  while (residencesUnderCapacity.length && homelessColonists.length) {
    // eslint-disable-next-line @typescript-eslint/no-loop-func
    homelessColonists.sort((a, b) => {
      const aValue = Math.min(
        ...residencesUnderCapacity.map((e) => getDistance(a.pos, e.pos))
      );
      const bValue = Math.min(
        ...residencesUnderCapacity.map((e) => getDistance(b.pos, e.pos))
      );
      return aValue - bValue;
    });
    const colonistToAssign = homelessColonists[0];

    residencesUnderCapacity.sort((a, b) => {
      const aValue = getDistance(colonistToAssign.pos, a.pos);
      const bValue = getDistance(colonistToAssign.pos, b.pos);
      return aValue - bValue;
    });
    const residenceToAssign = residencesUnderCapacity[0];

    state.act.updateEntity({
      id: colonistToAssign.id,
      colonist: {
        ...colonistToAssign.colonist,
        residence: residenceToAssign.id,
      },
    });
    state.act.updateEntity({
      id: residenceToAssign.id,
      housing: {
        ...residenceToAssign.housing,
        occupancy: residenceToAssign.housing.occupancy + 1,
      },
    });

    residencesUnderCapacity = state.select.residencesUnderCapacity();
    homelessColonists = state.select.homelessColonists();
  }
}
