import colors from "../../colors";
import {
  PRIORITY_BUILDING_HIGH,
  PRIORITY_BUILDING_LOW,
  MINE_WORK,
  FARM_WORK,
  FARM_PRODUCTION,
  FACTORY_WORK,
  REACTOR_PRODUCTION,
} from "../../constants";
import { JobTypeCode } from "../jobTypes";
import { ResourceCode } from "../resources";
import { Entity } from "../../types";
import { TemplateName } from "../../types/TemplateName";

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
  BUILDING_SPLITTER_BASE: {
    building: {},
    audioToggle: {
      soundName: "buzz",
      conditions: ["isPowered"],
    },
    blocking: { moving: true, lasers: true, windmill: true },
    destructible: { attackPriority: 2 },
    description: {
      name: "Splitter",
      description:
        "Splits one laser beam into 2 more beams. Needs 2 power per turn.",
    },
    colorToggle: {
      conditions: ["isPowered"],
      trueColor: colors.activeBuilding,
      falseColor: colors.inactiveBuilding,
    },
    powered: {
      hasPower: true,
      powerNeeded: 2,
      resourceChangeReason: "Splitters",
    },
  },
  BUILDING_SPLITTER_HORIZONTAL: {
    parentTemplate: "BUILDING_SPLITTER_BASE",
    display: {
      tile: "splitter",
      color: colors.activeBuilding,
      priority: PRIORITY_BUILDING_HIGH,
    },
    splitter: { type: "horizontal" },
  },
  BUILDING_SPLITTER_VERTICAL: {
    parentTemplate: "BUILDING_SPLITTER_BASE",
    display: {
      tile: "splitter",
      rotation: 90,
      color: colors.activeBuilding,
      priority: PRIORITY_BUILDING_HIGH,
    },
    splitter: { type: "vertical" },
  },
  BUILDING_SPLITTER_ADVANCED: {
    parentTemplate: "BUILDING_SPLITTER_BASE",
    display: {
      tile: "splitter_advanced",
      color: colors.activeBuilding,
      priority: PRIORITY_BUILDING_HIGH,
    },
    splitter: { type: "advanced" },
    destructible: { attackPriority: 3 },
    description: {
      name: "Adv. Splitter",
      description:
        "Splits one laser beam into 3 more beams. Needs 5 power per turn.",
    },
    powered: {
      hasPower: true,
      powerNeeded: 5,
      resourceChangeReason: "Adv. Splitters",
    },
  },
  BUILDING_TENT: {
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
    destructible: {
      attackPriority: 1,
    },
    description: {
      name: "Tent",
      description:
        "Temporary housing for 1 colonist. Colonists will move to residences if able.",
    },
  },
  BUILDING_RESIDENCE: {
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
    destructible: {
      attackPriority: 1,
    },
    description: {
      name: "Residence",
      description:
        "Provides housing for up to 3 colonists. Colonists will otherwise pitch tents wherever they are at sunset.",
    },
  },
  BUILDING_MINE: {
    building: {},
    audioToggle: {
      soundName: "mine_1",
      conditions: ["hasOneActiveWorker"],
    },
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
    destructible: {
      attackPriority: 1,
    },
    jobProvider: {
      consumes: {
        [ResourceCode.Power]: 1,
      },
      produces: {
        [ResourceCode.Metal]: 1,
      },
      workContributed: 1,
      workRequired: MINE_WORK,
      numberEmployed: 0,
      maxNumberEmployed: 2,
      jobType: JobTypeCode.Mining,
      resourceChangeReason: "Mining",
    },
    description: {
      name: "Mine",
      description:
        "Provides jobs for 2 colonists, so it can produce twice as fast as a Mining Spot, but each job consumes 1 power.",
    },
  },
  BUILDING_MINING_SPOT: {
    building: {},
    audioToggle: {
      soundName: "pickaxe_loop",
      conditions: ["hasOneActiveWorker"],
    },
    display: {
      tile: "mining_spot",
      color: colors.inactiveBuilding,
      priority: PRIORITY_BUILDING_LOW,
    },
    jobProvider: {
      consumes: {},
      produces: {
        [ResourceCode.Metal]: 1,
      },
      workContributed: 0,
      workRequired: MINE_WORK,
      numberEmployed: 0,
      maxNumberEmployed: 1,
      jobType: JobTypeCode.Mining,
      resourceChangeReason: "Mining",
    },
    description: {
      name: "Mining Spot",
      description: `Provides 1 job that produces Metal every ${MINE_WORK} turns. This building is VERY LOW (you can shoot and walk over it).`,
    },
  },
  BUILDING_FARM: {
    building: {},
    audioToggle: {
      soundName: "farm",
      conditions: ["hasOneActiveWorker"],
    },
    display: {
      tile: "farm",
      color: colors.food,
      priority: PRIORITY_BUILDING_LOW,
      hasBackground: true,
    },
    jobProvider: {
      consumes: {},
      produces: {
        [ResourceCode.Food]: FARM_PRODUCTION,
      },
      workContributed: 0,
      workRequired: FARM_WORK,
      numberEmployed: 0,
      maxNumberEmployed: 1,
      jobType: JobTypeCode.Farming,
      resourceChangeReason: "Farming",
    },
    destructible: {
      attackPriority: 2,
    },
    description: {
      name: "Farm",
      description: `Produces ${FARM_PRODUCTION} Food after being worked a whole day. This building is VERY LOW (you can shoot and walk over it).`,
    },
  },
  BUILDING_REACTOR: {
    building: {},
    audioToggle: {
      soundName: "buzz",
      conditions: ["hasOneActiveWorker"],
    },
    display: {
      tile: "powerplant",
      color: colors.activeBuilding,
      priority: PRIORITY_BUILDING_HIGH,
      hasBackground: true,
    },
    smokeEmitter: {
      emitters: [
        {
          conditions: [],
          offset: { x: 8, y: 10 },
        },
        {
          conditions: [],
          offset: { x: 19, y: 10 },
        },
      ],
    },
    destructible: {
      attackPriority: 3,
      explosive: true,
      onDestroy: "CLEAR_UI_OVERHEAT",
    },
    production: {
      resource: ResourceCode.Power,
      resourceChangeReason: "Reactors",
      amount: REACTOR_PRODUCTION,
      conditions: [],
    },
    temperature: {
      status: "normal",
      onOverheat: "DESTROY",
    },
    blocking: {
      moving: true,
      lasers: true,
      windmill: true,
    },
    description: {
      name: "Reactor",
      description: "Produces 10 power, but overheats if power isn't consumed",
    },
  },
  BUILDING_SOLAR_PANEL: {
    building: {},
    audioToggle: {
      soundName: "buzz",
      conditions: ["isDay"],
    },
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
    destructible: {
      attackPriority: 1,
    },
    production: {
      resource: ResourceCode.Power,
      amount: 1,
      conditions: ["isDay"],
      resourceChangeReason: "Solar Panels",
    },
    description: {
      name: "Solar Panel",
      description:
        "Produces 1 power per turn during day. Does not require a colonist to work. This building is LOW (you can shoot over it).",
    },
  },
  BUILDING_WINDMILL: {
    building: {},
    audioToggle: {
      soundName: "buzz",
      conditions: ["doesNotHaveTallNeighbors"],
    },
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
    destructible: {
      attackPriority: 3,
    },
    blocking: { moving: true, lasers: true, windmill: true },
    production: {
      resource: ResourceCode.Power,
      amount: 2,
      conditions: ["doesNotHaveTallNeighbors"],
      resourceChangeReason: "Windmills",
    },
    description: {
      name: "Windmill",
      description:
        "Produces 2 power as long as neighboring tiles are not blocked (only LOW and VERY LOW buildings allowed). Does not require a colonist to work.",
    },
  },
  BUILDING_FACTORY: {
    building: {},
    audioToggle: {
      soundName: "factory",
      soundOptions: { volume: 0.5, rollOff: 2 },
      conditions: ["hasOneActiveWorker"],
    },
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
    destructible: {
      attackPriority: 1,
    },
    jobProvider: {
      consumes: {
        POWER: 1,
        METAL: 1,
      },
      produces: {
        [ResourceCode.Machinery]: 1,
      },
      workContributed: 0,
      workRequired: FACTORY_WORK,
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
        "Provides 3 jobs that consume power and metal, and produce Machinery in 2 turns if fully worked.",
    },
  },
  BUILDING_WALL: {
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
      onDestroy: "SPAWN_BUILDING_WALL_DAMAGED",
      attackPriority: 0,
      movementCost: 5,
    },
    stopsLaser: {},
    description: {
      name: "Wall",
      description:
        "The most basic defense. Can take 2 hits, unlike other buildings which are destroyed in one hit.",
    },
  },
  BUILDING_WALL_DAMAGED: {
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
    destructible: {
      attackPriority: 0,
    },
    description: {
      name: "Damaged Wall",
      description: "This wall will be destroyed if hit again.",
    },
  },
  BUILDING_PROJECTOR_BASIC: {
    building: {},
    audioToggle: {
      soundName: "buzz",
      conditions: ["isPowered"],
    },
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
    destructible: {
      attackPriority: 3,
    },
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
  BUILDING_PROJECTOR_ADVANCED: {
    building: {},
    audioToggle: {
      soundName: "buzz",
      conditions: ["isPowered"],
    },
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
    destructible: {
      attackPriority: 5,
    },
    powered: {
      hasPower: true,
      powerNeeded: 4,
      resourceChangeReason: "Adv. Projectors",
    },
    projector: {
      condition: "isPowered",
      range: 2,
    },
    description: {
      name: "Adv. Projector",
      description:
        "Lets you place reflectors within 2 spaces. Needs 4 power per turn.",
    },
  },
  BUILDING_ROAD: {
    building: {},
    road: {},
    display: {
      tile: "road_0",
      color: colors.ground,
      priority: PRIORITY_BUILDING_LOW,
      hasBackground: true,
    },
    description: {
      name: "Road",
      description: "Lets colonists move 2 spaces per turn.",
    },
  },
  BUILDING_BATTERY: {
    building: {},
    display: {
      tile: "battery",
      color: colors.activeBuilding,
      priority: PRIORITY_BUILDING_LOW,
      hasBackground: true,
    },
    blocking: { moving: true, lasers: true, windmill: true },
    description: {
      name: "Battery",
      description: "Stored power. Explodes when destroyed.",
    },
    storage: {
      resources: { POWER: 100 },
    },
    destructible: { explosive: true, attackPriority: 1 },
  },
  BUILDING_WAREHOUSE: {
    building: {},
    display: {
      tile: "warehouse",
      color: colors.activeBuilding,
      priority: PRIORITY_BUILDING_LOW,
      hasBackground: true,
    },
    blocking: { moving: true, lasers: true, windmill: true },
    description: {
      name: "Warehouse",
      description: "Stores food, metal, and machinery.",
    },
    storage: {
      resources: { FOOD: 20, METAL: 20, MACHINERY: 20 },
    },
    destructible: { attackPriority: 1 },
  },
  BUILDING_RUBBLE: {
    building: {},
    display: {
      tile: "rubble",
      color: colors.inactiveBuilding,
      priority: PRIORITY_BUILDING_LOW,
    },
  },
};

export default templates;
