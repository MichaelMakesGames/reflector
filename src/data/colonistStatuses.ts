export enum ColonistStatusCode {
  Sleeping = "SLEEPING",
  Wandering = "WANDERING",
  GoingToWork = "GOING_TO_WORK",
  CannotFindPathToWork = "CANNOT_FIND_PATH_TO_WORK",
  Working = "WORKING",
  MissingResources = "MISSING_RESOURCES",
  GoingHome = "GOING_HOME",
  CannotFindPathHome = "CANNOT_FIND_PATH_HOME",
}

export interface ColonistStatus {
  code: ColonistStatusCode;
  label: string;
}

const colonistStatuses: Record<ColonistStatusCode, ColonistStatus> = {
  [ColonistStatusCode.Sleeping]: {
    code: ColonistStatusCode.Sleeping,
    label: "Sleeping",
  },
  [ColonistStatusCode.Wandering]: {
    code: ColonistStatusCode.Wandering,
    label: "Wandering",
  },
  [ColonistStatusCode.GoingToWork]: {
    code: ColonistStatusCode.GoingToWork,
    label: "Going to work",
  },
  [ColonistStatusCode.CannotFindPathToWork]: {
    code: ColonistStatusCode.CannotFindPathToWork,
    label: "Cannot find path to work",
  },
  [ColonistStatusCode.Working]: {
    code: ColonistStatusCode.Working,
    label: "Working",
  },
  [ColonistStatusCode.MissingResources]: {
    code: ColonistStatusCode.MissingResources,
    label: "Missing resources",
  },
  [ColonistStatusCode.GoingHome]: {
    code: ColonistStatusCode.GoingHome,
    label: "Going home",
  },
  [ColonistStatusCode.CannotFindPathHome]: {
    code: ColonistStatusCode.CannotFindPathHome,
    label: "Cannot find path home",
  },
};

export default colonistStatuses;
