import {
  PLAYER_ID,
  PROJECTOR_RANGE,
  PRIORITY_UNIT,
  PRIORITY_MARKER,
} from "../../constants";
import colors from "../../colors";
import { Entity } from "../../types";
import { ColonistStatusCode } from "../colonistStatuses";
import { TemplateName } from "../../types/TemplateName";

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
      onDestroy: "SPAWN_PLAYER_CORPSE",
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
  UI_VALID: {
    display: {
      tile: "outline_dashed",
      color: colors.secondary,
      priority: PRIORITY_MARKER,
    },
    validMarker: {},
  },
  UI_VALID_WITH_WARNING: {
    display: {
      tile: "outline_exclamation",
      color: colors.warning,
      priority: PRIORITY_MARKER,
    },
    validMarker: {},
  },
  UI_JOB_DISABLER: {
    display: {
      tile: "disabled",
      color: colors.invalid,
      priority: PRIORITY_MARKER,
    },
    jobDisabler: {},
  },
  UI_CURSOR: {
    display: {
      tile: "outline_solid",
      color: colors.secondary,
      priority: PRIORITY_MARKER,
      discreteMovement: true,
    },
    cursor: {},
  },
  UI_HIGHLIGHT: {
    display: {
      tile: ["outline_dashed", "blank"],
      speed: 0.05,
      color: colors.secondary,
      priority: PRIORITY_MARKER,
    },
    highlight: {},
  },
  UI_NO_METAL: {
    display: {
      tile: ["metal", "blank"],
      speed: 0.05,
      color: colors.mineral,
      priority: PRIORITY_MARKER,
    },
    missingResourceIndicator: {},
  },
  UI_NO_POWER: {
    display: {
      tile: ["power", "blank"],
      speed: 0.05,
      color: colors.power,
      priority: PRIORITY_MARKER,
    },
    missingResourceIndicator: {},
  },
  UI_OVERHEATING: {
    display: {
      tile: ["exclamation", "blank"],
      speed: 0.05,
      color: colors.laser,
      priority: PRIORITY_MARKER,
    },
  },
  COLONIST: {
    display: {
      tile: "colonists1",
      color: colors.player,
      priority: PRIORITY_UNIT,
    },
    destructible: {
      onDestroy: "ON_COLONIST_DESTROYED",
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
  UI_COLONISTS: {
    display: {
      tile: "colonists3",
      color: colors.player,
      priority: PRIORITY_UNIT,
    },
  },
  UI_PATH: {
    display: {
      tile: "target",
      color: colors.secondary,
      priority: PRIORITY_MARKER,
    },
    pathPreview: {
      index: 0,
    },
  },
  UI_PATH_DEEMPHASIZED: {
    display: {
      tile: "target",
      color: colors.inactiveBuilding,
      priority: PRIORITY_MARKER,
    },
    pathPreview: {
      index: 0,
    },
  },
  UI_BORDER_NORTH: {
    display: {
      tile: "border",
      color: colors.secondary,
      rotation: 0,
      priority: PRIORITY_MARKER,
    },
    border: {},
  },
  UI_BORDER_EAST: {
    display: {
      tile: "border",
      color: colors.secondary,
      rotation: 90,
      priority: PRIORITY_MARKER,
    },
    border: {},
  },
  UI_BORDER_SOUTH: {
    display: {
      tile: "border",
      color: colors.secondary,
      rotation: 180,
      priority: PRIORITY_MARKER,
    },
    border: {},
  },
  UI_BORDER_WEST: {
    display: {
      tile: "border",
      color: colors.secondary,
      rotation: 270,
      priority: PRIORITY_MARKER,
    },
    border: {},
  },
  UI_DIRECTION_E: {
    display: {
      tile: "direction-indicator",
      color: colors.enemyUnit,
      priority: PRIORITY_MARKER,
      rotation: 90,
    },
    directionIndicator: {},
  },
  UI_DIRECTION_N: {
    display: {
      tile: "direction-indicator",
      color: colors.enemyUnit,
      priority: PRIORITY_MARKER,
    },
    directionIndicator: {},
  },
  UI_DIRECTION_S: {
    display: {
      tile: "direction-indicator",
      color: colors.enemyUnit,
      priority: PRIORITY_MARKER,
      rotation: 180,
    },
    directionIndicator: {},
  },
  UI_DIRECTION_W: {
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
