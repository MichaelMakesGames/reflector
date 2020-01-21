import { PRIORITY_ITEM, PRIORITY_PLACING, PROJECTOR_RANGE } from "~/constants";
import colors from "~colors";
import { Entity } from "~types";

const templates: Partial<Record<TemplateName, Partial<Entity>>> = {
  REFLECTOR_BASE: {
    description: {
      name: "Reflector",
      description:
        "Reflects laser 90 degrees. It must be within range of either you or a projector, otherwise it is removed.",
    },
  },
  REFLECTOR_UP_RIGHT: {
    parentTemplate: "REFLECTOR_BASE",
    display: {
      tile: "reflector",
      glyph: "/",
      color: colors.activeBuilding,
      priority: PRIORITY_PLACING,
    },
    reflector: { type: "/" },
    rotatable: { rotatesTo: "REFLECTOR_DOWN_RIGHT" },
  },
  REFLECTOR_DOWN_RIGHT: {
    parentTemplate: "REFLECTOR_BASE",
    display: {
      tile: "reflector",
      rotation: 90,
      glyph: "\\",
      color: colors.activeBuilding,
      priority: PRIORITY_PLACING,
    },
    reflector: { type: "\\" },
    rotatable: { rotatesTo: "REFLECTOR_UP_RIGHT" },
  },
  SPLITTER_BASE: {
    blocking: { moving: true, lasers: true },
    destructible: {},
    description: {
      name: "Splitter",
      description: "Splits one incoming beam into two weaker beams.",
    },
  },
  SPLITTER_HORIZONTAL: {
    parentTemplate: "SPLITTER_BASE",
    display: {
      tile: "splitter",
      glyph: "⬌",
      color: colors.activeBuilding,
      priority: PRIORITY_PLACING,
    },
    splitter: { type: "horizontal" },
    rotatable: { rotatesTo: "SPLITTER_VERTICAL" },
  },
  SPLITTER_VERTICAL: {
    parentTemplate: "SPLITTER_BASE",
    display: {
      tile: "splitter",
      rotation: 90,
      glyph: "⬍",
      color: colors.activeBuilding,
      priority: PRIORITY_PLACING,
    },
    splitter: { type: "vertical" },
    rotatable: { rotatesTo: "SPLITTER_HORIZONTAL" },
  },
  TENT: {
    display: {
      tile: "tent",
      glyph: "▲",
      color: colors.activeBuilding,
      priority: PRIORITY_ITEM,
    },
    blocking: {
      moving: true,
      lasers: true,
    },
    housing: {
      capacity: 1,
      occupancy: 1,
      desirability: -1,
      removeOnVacancy: true,
    },
    destructible: {},
    description: {
      name: "Tent",
      description:
        "Temporary housing for 1 colonist. Colonists will move to residences if able.",
    },
  },
  RESIDENCE: {
    display: {
      tile: "residence",
      glyph: "R",
      color: colors.activeBuilding,
      priority: PRIORITY_ITEM,
    },
    blocking: {
      moving: true,
      lasers: true,
    },
    housing: {
      occupancy: 0,
      capacity: 3,
      desirability: 0,
    },
    destructible: {},
    description: {
      name: "Residence",
      description:
        "Provides housing for up to 3 colonists. Colonists will move out of tents to move into residences.",
    },
  },
  MINE: {
    display: {
      tile: "mine",
      glyph: "m",
      color: colors.activeBuilding,
      priority: PRIORITY_ITEM,
    },
    blocking: {
      moving: true,
      lasers: true,
    },
    destructible: {},
    jobProvider: {
      consumes: {},
      produces: {
        METAL: 1,
      },
      numberEmployed: 0,
      maxNumberEmployed: 2,
    },
    description: {
      name: "Mine",
      description: "Automatically mines metal, but must be built over ore.",
    },
  },
  FARM: {
    display: {
      tile: "farm",
      glyph: "F",
      color: colors.food,
      priority: PRIORITY_ITEM,
    },
    destructible: {},
    jobProvider: {
      consumes: {},
      produces: {
        FOOD: 0.2,
      },
      numberEmployed: 0,
      maxNumberEmployed: 1,
    },
    description: {
      name: "Farm",
      description:
        "Produces 0.2 food when worked by colonist. Up to 1 colonist can work at a time.",
    },
  },
  POWER_PLANT: {
    display: {
      tile: "powerplant",
      glyph: "P",
      color: colors.activeBuilding,
      priority: PRIORITY_ITEM,
    },
    destructible: {},
    jobProvider: {
      consumes: {},
      produces: {
        POWER: 0.5,
      },
      numberEmployed: 0,
      maxNumberEmployed: 2,
    },
    blocking: {
      moving: true,
      lasers: true,
    },
    description: {
      name: "Power Plant",
      description:
        "Produces 0.5 power when worked by colonist. Up to 2 colonists can work at a time.",
    },
  },
  WALL: {
    display: {
      tile: "wall",
      glyph: "#",
      color: colors.inactiveBuilding,
      priority: PRIORITY_ITEM,
    },
    blocking: {
      moving: true,
      lasers: true,
    },
    destructible: {
      onDestroy: "wall",
    },
    description: {
      name: "Wall",
      description:
        "The most basic defense. Can take 2 hits, unlike other buildings which are destroyed in one hit.",
    },
  },
  WALL_DAMAGED: {
    display: {
      tile: "wall_damaged",
      glyph: "#",
      color: colors.inactiveBuilding,
      priority: PRIORITY_ITEM,
    },
    blocking: {
      moving: true,
      lasers: true,
    },
    destructible: {},
    description: {
      name: "Damaged Wall",
      description: "This wall will be destroyed if hit again.",
    },
  },
  PROJECTOR: {
    display: {
      tile: "projector",
      glyph: "p",
      color: colors.activeBuilding,
      priority: PRIORITY_ITEM,
    },
    blocking: {
      moving: true,
      lasers: true,
    },
    destructible: {},
    projector: {
      range: PROJECTOR_RANGE,
    },
    description: {
      name: "Projector",
      description: "Lets you place reflectors around it.",
    },
  },
};

export default templates;
