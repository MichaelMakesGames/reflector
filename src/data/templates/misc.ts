import {
  PLAYER_ID,
  PROJECTOR_RANGE,
  PRIORITY_UNIT,
  PRIORITY_MARKER,
} from "~/constants";
import colors from "~colors";
import { Entity } from "~types";
import { ColonistStatusCode } from "~data/colonistStatuses";

const templates: Partial<Record<TemplateName, Partial<Entity>>> = {
  PLAYER: {
    id: PLAYER_ID,
    pos: { x: 1, y: 1 },
    display: {
      tile: "player",
      color: colors.payer,
      priority: PRIORITY_UNIT,
    },
    blocking: { moving: true, lasers: true },
    destructible: {
      onDestroy: "player",
    },
    conductive: {},
    projector: {
      condition: null,
      range: PROJECTOR_RANGE,
    },
    description: {
      name: "Player",
      description: "This is you.",
    },
  },
  PLAYER_CORPSE: {
    display: {
      tile: "skull",
      color: colors.payer,
      priority: PRIORITY_UNIT,
    },
    blocking: { moving: true, lasers: true },
  },
  VALID_MARKER: {
    display: {
      tile: "outline_dashed",
      color: colors.secondary,
      priority: PRIORITY_MARKER,
    },
    validMarker: {},
  },
  PLACING_MARKER: {
    display: {
      tile: "outline_solid",
      color: colors.invalid,
      priority: PRIORITY_MARKER,
    },
    placingMarker: {},
  },
  REMOVING_MARKER: {
    display: {
      tile: "outline_solid",
      color: colors.invalid,
      priority: PRIORITY_MARKER,
    },
    removingMarker: {},
  },
  DISABLE_MARKER: {
    display: {
      tile: "outline_solid",
      color: colors.invalid,
      priority: PRIORITY_MARKER,
    },
    disableMarker: {},
  },
  JOB_DISABLER: {
    display: {
      tile: "disabled",
      color: colors.invalid,
      priority: PRIORITY_MARKER,
    },
    jobDisabler: {},
  },
  INSPECTOR: {
    display: {
      tile: "outline_solid",
      color: colors.secondary,
      priority: PRIORITY_MARKER,
    },
    inspector: {},
  },
  CURSOR: {
    display: {
      tile: "outline_solid",
      color: colors.secondary,
      priority: PRIORITY_MARKER,
    },
    cursor: {},
  },
  COLONIST: {
    display: {
      tile: "colonists1",
      color: colors.payer,
      priority: PRIORITY_UNIT,
    },
    destructible: {
      onDestroy: "colonist",
    },
    colonist: {
      residence: null,
      employment: null,
      status: ColonistStatusCode.Wandering,
    },
    description: {
      name: "Colonist",
      description: "",
    },
  },
  BORDER_NORTH: {
    display: {
      tile: "border",
      color: colors.secondary,
      rotation: 0,
      priority: PRIORITY_MARKER,
    },
    border: {},
  },
  BORDER_EAST: {
    display: {
      tile: "border",
      color: colors.secondary,
      rotation: 90,
      priority: PRIORITY_MARKER,
    },
    border: {},
  },
  BORDER_SOUTH: {
    display: {
      tile: "border",
      color: colors.secondary,
      rotation: 180,
      priority: PRIORITY_MARKER,
    },
    border: {},
  },
  BORDER_WEST: {
    display: {
      tile: "border",
      color: colors.secondary,
      rotation: 270,
      priority: PRIORITY_MARKER,
    },
    border: {},
  },
};

export default templates;
