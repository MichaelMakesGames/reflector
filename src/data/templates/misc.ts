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
      color: colors.player,
      priority: PRIORITY_UNIT,
    },
    blocking: { moving: true, lasers: true, windmill: false },
    destructible: {
      onDestroy: "player",
      explosive: true,
      attackPriority: 0,
    },
    projector: {
      condition: null,
      range: PROJECTOR_RANGE,
    },
    description: {
      name: "Player",
      description: "This is you.",
    },
    storage: {
      resources: {
        MACHINERY: 20,
        METAL: 20,
        FOOD: 20,
        POWER: 100,
      },
    },
  },
  PLAYER_CORPSE: {
    display: {
      tile: "skull",
      color: colors.player,
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
      color: colors.warning,
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
  },
  CURSOR: {
    display: {
      tile: "outline_solid",
      color: colors.secondary,
      priority: PRIORITY_MARKER,
      discreteMovement: true,
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
      color: colors.player,
      priority: PRIORITY_UNIT,
    },
    destructible: {
      onDestroy: "colonist",
      attackPriority: 2,
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
  COLONISTS: {
    display: {
      tile: "colonists3",
      color: colors.player,
      priority: PRIORITY_UNIT,
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
  DIRECTION_INDICATOR_E: {
    display: {
      tile: "direction-indicator",
      color: colors.enemyUnit,
      priority: PRIORITY_MARKER,
      rotation: 90,
    },
    directionIndicator: {},
  },
  DIRECTION_INDICATOR_N: {
    display: {
      tile: "direction-indicator",
      color: colors.enemyUnit,
      priority: PRIORITY_MARKER,
    },
    directionIndicator: {},
  },
  DIRECTION_INDICATOR_S: {
    display: {
      tile: "direction-indicator",
      color: colors.enemyUnit,
      priority: PRIORITY_MARKER,
      rotation: 180,
    },
    directionIndicator: {},
  },
  DIRECTION_INDICATOR_W: {
    display: {
      tile: "direction-indicator",
      color: colors.enemyUnit,
      priority: PRIORITY_MARKER,
      rotation: 270,
    },
    directionIndicator: {},
  },
  NONE: {},
};

export default templates;
