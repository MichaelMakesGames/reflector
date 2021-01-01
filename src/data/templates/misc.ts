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
    blocking: { moving: true, lasers: true, windmill: false },
    destructible: {
      onDestroy: "player",
    },
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
    blocking: { moving: true, lasers: true, windmill: false },
  },
  VALID_MARKER: {
    display: {
      tile: "outline_dashed",
      color: colors.secondary,
      priority: PRIORITY_MARKER,
    },
    validMarker: {},
  },
  VALID_WITH_WARNING_MARKER: {
    display: {
      tile: "outline_exclamation",
      color: colors.invalid,
      priority: PRIORITY_MARKER,
    },
    validMarker: {},
  },
  JOB_DISABLER: {
    display: {
      tile: "disabled",
      color: colors.invalid,
      priority: PRIORITY_MARKER,
    },
    jobDisabler: {},
    destructible: {},
  },
  CURSOR: {
    display: {
      tile: "outline_solid",
      color: colors.secondary,
      priority: PRIORITY_MARKER,
    },
    cursor: {},
  },
  HIGHLIGHT: {
    display: {
      tile: ["outline_dashed", "blank"],
      speed: 0.05,
      color: colors.secondary,
      priority: PRIORITY_MARKER,
    },
    highlight: {},
  },
  NO_METAL_INDICATOR: {
    display: {
      tile: ["metal", "blank"],
      speed: 0.05,
      color: colors.mineral,
      priority: PRIORITY_MARKER,
    },
    missingResourceIndicator: {},
  },
  NO_POWER_INDICATOR: {
    display: {
      tile: ["power", "blank"],
      speed: 0.05,
      color: colors.power,
      priority: PRIORITY_MARKER,
    },
    missingResourceIndicator: {},
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
      missingResources: [],
    },
    description: {
      name: "Colonist",
      description: "",
    },
  },
  PATH_PREVIEW: {
    display: {
      tile: "target",
      color: colors.secondary,
      priority: PRIORITY_MARKER,
    },
    pathPreview: {
      index: 0,
    },
  },
  PATH_PREVIEW_DEEMPHASIZED: {
    display: {
      tile: "target",
      color: colors.inactiveBuilding,
      priority: PRIORITY_MARKER,
    },
    pathPreview: {
      index: 0,
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
  NONE: {},
};

export default templates;
