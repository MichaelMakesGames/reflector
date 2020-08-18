import colors from "~colors";
import { Entity } from "~types";
import { PRIORITY_BUILDING_HIGH, PRIORITY_BUILDING_LOW } from "~constants";
import { ResourceCode } from "~data/resources";
import { JobTypeCode } from "~data/jobTypes";

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
    colorToggle: {
      conditions: ["isPowered"],
      trueColor: colors.activeBuilding,
      falseColor: colors.inactiveBuilding,
    },
  },
  SPLITTER_HORIZONTAL: {
    parentTemplate: "SPLITTER_BASE",
    display: {
      tile: "splitter",
      color: colors.activeBuilding,
      priority: PRIORITY_BUILDING_HIGH,
    },
    splitter: { type: "horizontal" },
    rotatable: { rotatesTo: "SPLITTER_VERTICAL" },
    powered: {
      hasPower: true,
      powerNeeded: 1,
      resourceChangeReason: "Splitters",
    },
  },
  SPLITTER_VERTICAL: {
    parentTemplate: "SPLITTER_BASE",
    display: {
      tile: "splitter",
      rotation: 90,
      color: colors.activeBuilding,
      priority: PRIORITY_BUILDING_HIGH,
    },
    splitter: { type: "vertical" },
    rotatable: { rotatesTo: "SPLITTER_HORIZONTAL" },
    powered: {
      hasPower: true,
      powerNeeded: 1,
      resourceChangeReason: "Splitters",
    },
  },
  SPLITTER_ADVANCED: {
    parentTemplate: "SPLITTER_BASE",
    display: {
      tile: "splitter_advanced",
      color: colors.activeBuilding,
      priority: PRIORITY_BUILDING_HIGH,
    },
    splitter: { type: "advanced" },
    powered: {
      hasPower: true,
      powerNeeded: 2,
      resourceChangeReason: "Adv. Splitters",
    },
  },
  TENT: {
    building: {},
    display: {
      tile: "tent",
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
      consumes: {
        [ResourceCode.Power]: 1,
      },
      produces: {
        [ResourceCode.Metal]: 2,
      },
      numberEmployed: 0,
      maxNumberEmployed: 2,
      jobType: JobTypeCode.Mining,
      resourceChangeReason: "Mining",
    },
    description: {
      name: "Mine",
      description:
        "Provides jobs for 2 colonists that each produce 2 metal but consume 1 power.",
    },
  },
  MINING_SPOT: {
    building: {},
    display: {
      tile: "outline_solid",
      color: colors.activeBuilding,
      priority: PRIORITY_BUILDING_LOW,
    },
    destructible: {},
    jobProvider: {
      consumes: {},
      produces: {
        [ResourceCode.Metal]: 1,
      },
      numberEmployed: 0,
      maxNumberEmployed: 1,
      jobType: JobTypeCode.Mining,
      resourceChangeReason: "Mining (at mining spot)",
    },
    description: {
      name: "Mine",
      description:
        "Free to build, but less efficient than a mine. Provides 1 job that produces 1 metal when mined.",
    },
  },
  FARM: {
    building: {},
    display: {
      tile: "farm",
      color: colors.food,
      priority: PRIORITY_BUILDING_LOW,
      hasBackground: true,
    },
    destructible: {},
    jobProvider: {
      consumes: {},
      produces: {
        [ResourceCode.Food]: 1,
      },
      numberEmployed: 0,
      maxNumberEmployed: 1,
      jobType: JobTypeCode.Farming,
      resourceChangeReason: "Farming",
    },
    description: {
      name: "Farm",
      description:
        "Produces 1 food when worked by colonist. Up to 1 colonist can work at a time.",
    },
  },
  POWER_PLANT: {
    building: {},
    display: {
      tile: "powerplant",
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
        [ResourceCode.Power]: 1,
      },
      numberEmployed: 0,
      maxNumberEmployed: 2,
      jobType: JobTypeCode.Power,
      resourceChangeReason: "Power Plant",
    },
    blocking: {
      moving: true,
      lasers: true,
    },
    description: {
      name: "Power Plant",
      description:
        "Produces 1 power when worked by colonist. Up to 2 colonists can work at a time.",
    },
  },
  SOLAR_PANEL: {
    building: {},
    display: {
      tile: "solarpanel",
      color: colors.activeBuilding,
      priority: PRIORITY_BUILDING_LOW,
      hasBackground: true,
    },
    colorToggle: {
      conditions: ["isDay"],
      trueColor: colors.activeBuilding,
      falseColor: colors.inactiveBuilding,
    },
    destructible: {},
    production: {
      resource: ResourceCode.Power,
      amount: 1,
      conditions: ["isDay"],
      resourceChangeReason: "Solar Panels",
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
      color: colors.activeBuilding,
      priority: PRIORITY_BUILDING_HIGH,
      hasBackground: true,
    },
    colorToggle: {
      conditions: ["doesNotHaveTallNeighbors"],
      trueColor: colors.activeBuilding,
      falseColor: colors.inactiveBuilding,
    },
    destructible: {},
    blocking: { moving: true, lasers: true },
    production: {
      resource: ResourceCode.Power,
      amount: 1,
      conditions: ["doesNotHaveTallNeighbors"],
      resourceChangeReason: "Windmills",
    },
    description: {
      name: "Windmill",
      description:
        "Produces 1 power as long as the neighboring tiles are not blocked.",
    },
  },
  FACTORY: {
    building: {},
    display: {
      tile: "furnace",
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
      jobType: JobTypeCode.Manufacturing,
      resourceChangeReason: "Manufacturing",
    },
    blocking: {
      moving: true,
      lasers: true,
    },
    description: {
      name: "Factory",
      description:
        "Provides 3 jobs that consume 2 metal and 1 power to produce 1 refined metal",
    },
  },
  WALL: {
    building: {},
    display: {
      tile: "wall",
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
      color: colors.activeBuilding,
      priority: PRIORITY_BUILDING_HIGH,
      hasBackground: true,
    },
    colorToggle: {
      conditions: ["isPowered"],
      trueColor: colors.activeBuilding,
      falseColor: colors.inactiveBuilding,
    },
    blocking: {
      moving: true,
      lasers: true,
    },
    destructible: {},
    powered: {
      hasPower: true,
      powerNeeded: 1,
      resourceChangeReason: "Projectors",
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
      color: colors.activeBuilding,
      priority: PRIORITY_BUILDING_HIGH,
      hasBackground: true,
    },
    colorToggle: {
      conditions: ["isPowered"],
      trueColor: colors.activeBuilding,
      falseColor: colors.inactiveBuilding,
    },
    blocking: {
      moving: true,
      lasers: true,
    },
    destructible: {},
    powered: {
      hasPower: true,
      powerNeeded: 2,
      resourceChangeReason: "Adv. Projectors",
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
