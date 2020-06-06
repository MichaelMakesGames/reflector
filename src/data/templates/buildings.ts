import colors from "~colors";
import { Entity } from "~types";
import { PRIORITY_BUILDING_HIGH, PRIORITY_BUILDING_LOW } from "~constants";
import { ResourceCode } from "~data/resources";

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
      priority: PRIORITY_BUILDING_HIGH,
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
      priority: PRIORITY_BUILDING_HIGH,
    },
    reflector: { type: "\\" },
    rotatable: { rotatesTo: "REFLECTOR_UP_RIGHT" },
  },
  SPLITTER_BASE: {
    building: {},
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
      priority: PRIORITY_BUILDING_HIGH,
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
      priority: PRIORITY_BUILDING_HIGH,
    },
    splitter: { type: "vertical" },
    rotatable: { rotatesTo: "SPLITTER_HORIZONTAL" },
  },
  SPLITTER_ADVANCED: {
    parentTemplate: "SPLITTER_BASE",
    display: {
      tile: "splitter_advanced",
      glyph: "+",
      color: colors.activeBuilding,
      priority: PRIORITY_BUILDING_HIGH,
    },
    splitter: { type: "advanced" },
  },
  TENT: {
    building: {},
    display: {
      tile: "tent",
      glyph: "▲",
      color: colors.activeBuilding,
      priority: PRIORITY_BUILDING_HIGH,
      hasBackground: false,
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
    building: {},
    display: {
      tile: "residence",
      glyph: "R",
      color: colors.activeBuilding,
      priority: PRIORITY_BUILDING_HIGH,
      hasBackground: true,
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
    building: {},
    display: {
      tile: "mine",
      glyph: "M",
      color: colors.activeBuilding,
      priority: PRIORITY_BUILDING_HIGH,
      hasBackground: true,
    },
    smokeEmitter: {
      emitters: [
        {
          conditions: ["hasOneActiveWorker"],
          offset: { x: 3, y: 10 },
        },
        {
          conditions: ["hasTwoActiveWorkers"],
          offset: { x: 14, y: 7 },
        },
      ],
    },
    blocking: {
      moving: true,
      lasers: true,
    },
    destructible: {},
    jobProvider: {
      consumes: {},
      produces: {
        [ResourceCode.Metal]: 1,
      },
      numberEmployed: 0,
      maxNumberEmployed: 2,
      jobType: "MINING",
    },
    description: {
      name: "Mine",
      description: "Automatically mines metal, but must be built over ore.",
    },
  },
  MINING_SPOT: {
    building: {},
    display: {
      tile: "outline_solid",
      glyph: "m",
      color: colors.activeBuilding,
      priority: PRIORITY_BUILDING_LOW,
    },
    destructible: {},
    jobProvider: {
      consumes: {},
      produces: {
        [ResourceCode.Metal]: 0.5,
      },
      numberEmployed: 0,
      maxNumberEmployed: 1,
      jobType: "MINING",
    },
    description: {
      name: "Mine",
      description:
        "Free to build, but less efficient than a mine. Provides 1 job that produces 0.5 metal when mined.",
    },
  },
  FARM: {
    building: {},
    display: {
      tile: "farm",
      glyph: "F",
      color: colors.food,
      priority: PRIORITY_BUILDING_LOW,
      hasBackground: true,
    },
    destructible: {},
    jobProvider: {
      consumes: {},
      produces: {
        [ResourceCode.Food]: 0.2,
      },
      numberEmployed: 0,
      maxNumberEmployed: 1,
      jobType: "FARMING",
    },
    description: {
      name: "Farm",
      description:
        "Produces 0.2 food when worked by colonist. Up to 1 colonist can work at a time.",
    },
  },
  POWER_PLANT: {
    building: {},
    display: {
      tile: "powerplant",
      glyph: "P",
      color: colors.activeBuilding,
      priority: PRIORITY_BUILDING_HIGH,
      hasBackground: true,
    },
    smokeEmitter: {
      emitters: [
        {
          conditions: ["hasOneActiveWorker"],
          offset: { x: 8, y: 10 },
        },
        {
          conditions: ["hasTwoActiveWorkers"],
          offset: { x: 19, y: 10 },
        },
      ],
    },
    destructible: {},
    jobProvider: {
      consumes: {},
      produces: {
        [ResourceCode.Power]: 0.5,
      },
      numberEmployed: 0,
      maxNumberEmployed: 2,
      jobType: "POWER",
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
  SOLAR_PANEL: {
    building: {},
    display: {
      tile: "solarpanel",
      glyph: "S",
      color: colors.activeBuilding,
      priority: PRIORITY_BUILDING_LOW,
      hasBackground: true,
    },
    destructible: {},
    production: {
      resource: ResourceCode.Power,
      amount: 1,
      conditions: ["isDay"],
    },
    description: {
      name: "Solar Panel",
      description:
        "Produces 1 power during day. Does not require a working colonist.",
    },
  },
  WINDMILL: {
    building: {},
    display: {
      tile: "windmill",
      glyph: "W",
      color: colors.activeBuilding,
      priority: PRIORITY_BUILDING_HIGH,
      hasBackground: true,
    },
    destructible: {},
    blocking: { moving: true, lasers: true },
    production: {
      resource: ResourceCode.Power,
      amount: 1,
      conditions: ["doesNotHaveTallNeighbors"],
    },
    description: {
      name: "Windmill",
      description:
        "Produces 1 power as long as the neighboring tiles are not blocked.",
    },
  },
  FURNACE: {
    building: {},
    display: {
      tile: "furnace",
      glyph: "R",
      color: colors.activeBuilding,
      priority: PRIORITY_BUILDING_HIGH,
      hasBackground: true,
    },
    smokeEmitter: {
      emitters: [
        {
          conditions: ["hasOneActiveWorker"],
          offset: { x: 5, y: 5 },
        },
        {
          conditions: ["hasTwoActiveWorkers"],
          offset: { x: 12, y: 5 },
        },
        {
          conditions: ["hasThreeActiveWorkers"],
          offset: { x: 19, y: 5 },
        },
      ],
    },
    destructible: {},
    jobProvider: {
      consumes: {
        POWER: 1,
        METAL: 2,
      },
      produces: {
        [ResourceCode.Machinery]: 1,
      },
      numberEmployed: 0,
      maxNumberEmployed: 3,
      jobType: "REFINING",
    },
    blocking: {
      moving: true,
      lasers: true,
    },
    description: {
      name: "Furnace",
      description:
        "Provides 3 jobs that consume 2 metal and 1 power to produce 1 refined metal",
    },
  },
  WALL: {
    building: {},
    display: {
      tile: "wall",
      glyph: "#",
      color: colors.inactiveBuilding,
      priority: PRIORITY_BUILDING_HIGH,
      hasBackground: true,
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
    building: {},
    display: {
      tile: "wall_damaged",
      glyph: "#",
      color: colors.inactiveBuilding,
      priority: PRIORITY_BUILDING_HIGH,
      hasBackground: true,
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
  BASIC_PROJECTOR: {
    building: {},
    display: {
      tile: "basic_projector",
      glyph: "p",
      color: colors.activeBuilding,
      priority: PRIORITY_BUILDING_HIGH,
      hasBackground: true,
    },
    blocking: {
      moving: true,
      lasers: true,
    },
    destructible: {},
    powered: {
      hasPower: true,
      powerNeeded: 1,
    },
    projector: {
      condition: "isPowered",
      range: 1,
    },
    description: {
      name: "Projector",
      description: "Lets you place reflectors around it.",
    },
  },
  PROJECTOR: {
    building: {},
    display: {
      tile: "projector",
      glyph: "p",
      color: colors.activeBuilding,
      priority: PRIORITY_BUILDING_HIGH,
      hasBackground: true,
    },
    blocking: {
      moving: true,
      lasers: true,
    },
    destructible: {},
    powered: {
      hasPower: true,
      powerNeeded: 2,
    },
    projector: {
      condition: "isPowered",
      range: 2,
    },
    description: {
      name: "Projector",
      description: "Lets you place reflectors around it.",
    },
  },
};

export default templates;
