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
    blocking: { moving: true, lasers: true, windmill: true },
    destructible: {},
    description: {
      name: "Splitter",
      description:
        "Splits one laser beam into 2 more beams. Needs 1 power per turn.",
    },
    colorToggle: {
      conditions: ["isPowered"],
      trueColor: colors.activeBuilding,
      falseColor: colors.inactiveBuilding,
    },
    powered: {
      hasPower: true,
      powerNeeded: 1,
      resourceChangeReason: "Splitters",
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
  },
  SPLITTER_ADVANCED: {
    parentTemplate: "SPLITTER_BASE",
    display: {
      tile: "splitter_advanced",
      color: colors.activeBuilding,
      priority: PRIORITY_BUILDING_HIGH,
    },
    splitter: { type: "advanced" },
    description: {
      name: "Adv. Splitter",
      description:
        "Splits one laser beam into 3 more beams. Needs 2 power per turn.",
    },
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
      lasers: false,
      windmill: false,
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
      windmill: true,
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
        "Provides housing for up to 3 colonists. Colonists with higher priority jobs get first pick.",
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
      windmill: true,
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
        "Provides 2 jobs, that each consume 1 power to produce 2 metal per turn.",
    },
  },
  MINING_SPOT: {
    building: {},
    display: {
      tile: "outline_solid",
      color: colors.activeBuilding,
      priority: PRIORITY_BUILDING_LOW,
    },
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
      name: "Mining Spot",
      description:
        "Provides 1 job that produces 1 metal per turn. Less efficient than a Mine, but is free to build and doesn't need power.",
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
      description: "Provided 1 job that produces 1 food per turn.",
    },
  },
  REACTOR: {
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
      resourceChangeReason: "Reactor",
    },
    blocking: {
      moving: true,
      lasers: true,
      windmill: true,
    },
    description: {
      name: "Reactor",
      description: "Provides 2 jobs that each produce 1 power per turn.",
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
    blocking: {
      moving: true,
      lasers: false,
      windmill: false,
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
        "Produces 1 power per turn during day. Does not require a colonist to work.",
    },
  },
  WINDMILL: {
    building: {},
    display: {
      tile: ["windmill-1", "windmill-2", "windmill-3", "windmill-4"],
      color: colors.activeBuilding,
      priority: PRIORITY_BUILDING_HIGH,
      hasBackground: true,
    },
    animationToggle: {
      conditions: ["doesNotHaveTallNeighbors"],
    },
    colorToggle: {
      conditions: ["doesNotHaveTallNeighbors"],
      trueColor: colors.activeBuilding,
      falseColor: colors.inactiveBuilding,
    },
    destructible: {},
    blocking: { moving: true, lasers: true, windmill: true },
    production: {
      resource: ResourceCode.Power,
      amount: 1,
      conditions: ["doesNotHaveTallNeighbors"],
      resourceChangeReason: "Windmills",
    },
    description: {
      name: "Windmill",
      description:
        "Produces 1 power as long as neighboring tiles are not blocked. Does not require a colonist to work.",
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
      windmill: true,
    },
    description: {
      name: "Factory",
      description:
        "Provides 3 jobs that consume 1 power and 2 metal to produce 1 machinery per turn.",
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
      windmill: true,
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
      windmill: true,
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
      windmill: true,
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
      description:
        "Lets you place reflectors in neighboring tiles. Needs 1 power per turn.",
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
      windmill: true,
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
      name: "Adv. Projector",
      description:
        "Lets you place reflector within 2 spaces. Needs 2 power per turn.",
    },
  },
};

export default templates;
