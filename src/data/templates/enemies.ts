import colors from "../../colors";
import {
  DEMO_PAUSE_LONG,
  DEMO_PAUSE_SHORT,
  LEFT,
  PLAYER_ID,
  PRIORITY_UNIT,
} from "../../constants";
import { Entity } from "../../types";
import { TemplateName } from "../../types/TemplateName";

const templates: Partial<Record<TemplateName, Partial<Entity>>> = {
  ENEMY_BASE: {
    blocking: { moving: true, lasers: true, windmill: false },
    destructible: {},
  },
  ENEMY_DRONE: {
    parentTemplate: "ENEMY_BASE",
    display: {
      tile: ["enemy_drone_1", "enemy_drone_2"],
      speed: 0.03,
      color: colors.enemyUnit,
      priority: PRIORITY_UNIT,
      flashWhenVisible: true,
    },
    ai: {
      type: "DRONE",
      target: null,
      plannedAction: null,
      plannedActionDirection: null,
    },
    description: {
      name: "Soldier",
      description:
        "The most basic enemy. It targets the player or nearest building.",
      shortDescription: "basic enemy",
    },
    demo: {
      width: 6,
      height: 3,
      entities: {
        [PLAYER_ID]: ["PLAYER", { pos: { x: 6, y: 1 }, projector: undefined }],
        enemy: ["ENEMY_DRONE", { pos: { x: 1, y: 1 } }],
      },
      actions: [
        { type: "PLAYER_TOOK_TURN" },
        DEMO_PAUSE_LONG,
        {
          type: "PLAYER_TOOK_TURN",
        },
        DEMO_PAUSE_SHORT,
        { type: "PLAYER_TOOK_TURN" },
        DEMO_PAUSE_SHORT,
        {
          type: "TARGET_WEAPON",
          payload: { direction: LEFT, source: PLAYER_ID },
        },
        DEMO_PAUSE_LONG,
        { type: "FIRE_WEAPON", payload: { source: PLAYER_ID } },
        DEMO_PAUSE_LONG,
      ],
    },
  },
  ENEMY_VOLATILE: {
    parentTemplate: "ENEMY_BASE",
    display: {
      tile: ["enemy_volatile_1", "enemy_volatile_2"],
      speed: 0.03,
      color: colors.enemyUnit,
      priority: PRIORITY_UNIT,
      flashWhenVisible: true,
    },
    destructible: { explosive: true },
    ai: {
      type: "DRONE",
      target: null,
      plannedAction: null,
      plannedActionDirection: null,
    },
    description: {
      name: "Volatile",
      description: "Explodes when killed, damaging everything adjacent.",
      shortDescription: "explosive enemy",
    },
    demo: {
      width: 6,
      height: 3,
      entities: {
        [PLAYER_ID]: ["PLAYER", { pos: { x: 6, y: 1 }, projector: undefined }],
        enemy: ["ENEMY_VOLATILE", { pos: { x: 1, y: 1 } }],
        windmill: [
          "BUILDING_WINDMILL",
          { pos: { x: 3, y: 0 }, destructible: { attackPriority: undefined } },
        ],
        factory: [
          "BUILDING_FACTORY",
          { pos: { x: 3, y: 2 }, destructible: { attackPriority: undefined } },
        ],
      },
      actions: [
        { type: "PLAYER_TOOK_TURN" },
        DEMO_PAUSE_LONG,
        {
          type: "PLAYER_TOOK_TURN",
        },
        DEMO_PAUSE_SHORT,
        { type: "PLAYER_TOOK_TURN" },
        DEMO_PAUSE_SHORT,
        {
          type: "TARGET_WEAPON",
          payload: { direction: LEFT, source: PLAYER_ID },
        },
        DEMO_PAUSE_LONG,
        { type: "FIRE_WEAPON", payload: { source: PLAYER_ID } },
        DEMO_PAUSE_LONG,
      ],
    },
  },
  ENEMY_ARMORED: {
    parentTemplate: "ENEMY_BASE",
    display: {
      tile: ["enemy_armored_1", "enemy_armored_2"],
      speed: 0.03,
      color: colors.enemyUnit,
      priority: PRIORITY_UNIT,
      flashWhenVisible: true,
    },
    destructible: { onDestroy: "SPAWN_ENEMY_DRONE" },
    stopsLaser: {},
    ai: {
      type: "DRONE",
      target: null,
      plannedAction: null,
      plannedActionDirection: null,
    },
    description: {
      name: "Beetle",
      description: "A bug with a thick armored shell that blocks 1 attack.",
      shortDescription: "armored enemy",
    },
    demo: {
      width: 6,
      height: 3,
      entities: {
        [PLAYER_ID]: ["PLAYER", { pos: { x: 6, y: 1 }, projector: undefined }],
        ARMORED: ["ENEMY_ARMORED", { pos: { x: 1, y: 1 } }],
      },
      actions: [
        { type: "PLAYER_TOOK_TURN" },
        DEMO_PAUSE_LONG,
        {
          type: "TARGET_WEAPON",
          payload: { direction: LEFT, source: PLAYER_ID },
        },
        DEMO_PAUSE_LONG,
        {
          type: "FIRE_WEAPON",
          payload: { source: PLAYER_ID },
        },
        DEMO_PAUSE_SHORT,
        { type: "PLAYER_TOOK_TURN" },
        DEMO_PAUSE_SHORT,
        {
          type: "TARGET_WEAPON",
          payload: { direction: LEFT, source: PLAYER_ID },
        },
        DEMO_PAUSE_LONG,
        { type: "FIRE_WEAPON", payload: { source: PLAYER_ID } },
        DEMO_PAUSE_LONG,
      ],
    },
  },
  ENEMY_FLYER: {
    parentTemplate: "ENEMY_BASE",
    display: {
      tile: ["enemy_flyer_1", "enemy_flyer_2"],
      speed: 0.03,
      color: colors.enemyUnit,
      priority: PRIORITY_UNIT,
      flashWhenVisible: true,
    },
    ai: {
      type: "FLYER",
      target: null,
      plannedAction: null,
      plannedActionDirection: null,
    },
    description: {
      name: "Flyer",
      description: "A winged bug that can fly over water.",
      shortDescription: "flying enemy",
    },
    demo: {
      width: 6,
      height: 3,
      entities: {
        [PLAYER_ID]: ["PLAYER", { pos: { x: 6, y: 1 }, projector: undefined }],
        enemy: ["ENEMY_FLYER", { pos: { x: 1, y: 1 } }],
        water1: ["TERRAIN_WATER_7", { pos: { x: 2, y: 0 } }],
        water2: ["TERRAIN_WATER_7", { pos: { x: 2, y: 1 } }],
        water3: ["TERRAIN_WATER_7", { pos: { x: 2, y: 2 } }],
        water4: ["TERRAIN_WATER_13", { pos: { x: 3, y: 0 } }],
        water5: ["TERRAIN_WATER_13", { pos: { x: 3, y: 1 } }],
        water6: ["TERRAIN_WATER_13", { pos: { x: 3, y: 2 } }],
        corner1: ["TERRAIN_WATER_CORNER_NE", { pos: { x: 2, y: 0 } }],
        corner2: ["TERRAIN_WATER_CORNER_NE", { pos: { x: 2, y: 1 } }],
        corner3: ["TERRAIN_WATER_CORNER_NE", { pos: { x: 2, y: 2 } }],
        corner4: ["TERRAIN_WATER_CORNER_SE", { pos: { x: 2, y: 0 } }],
        corner5: ["TERRAIN_WATER_CORNER_SE", { pos: { x: 2, y: 1 } }],
        corner6: ["TERRAIN_WATER_CORNER_SE", { pos: { x: 2, y: 2 } }],
        corner7: ["TERRAIN_WATER_CORNER_NW", { pos: { x: 3, y: 0 } }],
        corner8: ["TERRAIN_WATER_CORNER_NW", { pos: { x: 3, y: 1 } }],
        corner9: ["TERRAIN_WATER_CORNER_NW", { pos: { x: 3, y: 2 } }],
        cornerA: ["TERRAIN_WATER_CORNER_SW", { pos: { x: 3, y: 0 } }],
        cornerB: ["TERRAIN_WATER_CORNER_SW", { pos: { x: 3, y: 1 } }],
        cornerC: ["TERRAIN_WATER_CORNER_SW", { pos: { x: 3, y: 2 } }],
      },
      actions: [
        { type: "PLAYER_TOOK_TURN" },
        DEMO_PAUSE_LONG,
        {
          type: "PLAYER_TOOK_TURN",
        },
        DEMO_PAUSE_SHORT,
        { type: "PLAYER_TOOK_TURN" },
        DEMO_PAUSE_SHORT,
        { type: "PLAYER_TOOK_TURN" },
        DEMO_PAUSE_SHORT,
        {
          type: "TARGET_WEAPON",
          payload: { direction: LEFT, source: PLAYER_ID },
        },
        DEMO_PAUSE_LONG,
        { type: "FIRE_WEAPON", payload: { source: PLAYER_ID } },
        DEMO_PAUSE_LONG,
      ],
    },
  },
  ENEMY_BURROWER: {
    parentTemplate: "ENEMY_BASE",
    display: {
      tile: ["enemy_burrower_1", "enemy_burrower_2"],
      speed: 0.03,
      color: colors.enemyUnit,
      priority: PRIORITY_UNIT,
      flashWhenVisible: true,
    },
    ai: {
      type: "BURROWER",
      target: null,
      plannedAction: null,
      plannedActionDirection: null,
    },
    description: {
      name: "Burrower",
      description: "Digs underground until ready to attack.",
      shortDescription: "digging enemy",
    },
    demo: {
      width: 6,
      height: 3,
      entities: {
        [PLAYER_ID]: ["PLAYER", { pos: { x: 6, y: 1 }, projector: undefined }],
        enemy: ["ENEMY_BURROWED", { pos: { x: 1, y: 1 } }],
        building: ["BUILDING_FACTORY", { pos: { x: 4, y: 2 } }],
      },
      actions: [
        { type: "PLAYER_TOOK_TURN" },
        DEMO_PAUSE_LONG,
        {
          type: "PLAYER_TOOK_TURN",
        },
        DEMO_PAUSE_SHORT,
        { type: "PLAYER_TOOK_TURN" },
        DEMO_PAUSE_SHORT,
        { type: "PLAYER_TOOK_TURN" },
        DEMO_PAUSE_SHORT,
        {
          type: "TARGET_WEAPON",
          payload: { direction: LEFT, source: PLAYER_ID },
        },
        DEMO_PAUSE_LONG,
        { type: "FIRE_WEAPON", payload: { source: PLAYER_ID } },
        DEMO_PAUSE_LONG,
        { type: "PLAYER_TOOK_TURN" },
        DEMO_PAUSE_SHORT,
        {
          type: "TARGET_WEAPON",
          payload: { direction: LEFT, source: PLAYER_ID },
        },
        DEMO_PAUSE_LONG,
        { type: "FIRE_WEAPON", payload: { source: PLAYER_ID } },
        DEMO_PAUSE_LONG,
      ],
    },
  },
  ENEMY_BURROWED: {
    parentTemplate: "ENEMY_BURROWER",
    display: {
      tile: ["enemy_burrowed_1", "enemy_burrowed_2"],
      speed: 0.03,
      color: colors.enemyUnit,
      priority: PRIORITY_UNIT,
      flashWhenVisible: true,
    },
    ai: {
      type: "BURROWED",
      target: null,
      plannedAction: null,
      plannedActionDirection: null,
    },
    description: {
      name: "Burrower (underground)",
      description: "A bug that digs underground until ready to attack.",
      shortDescription: "digging enemy",
    },
    blocking: {
      moving: true,
      windmill: false,
      lasers: false,
    },
  },
};

export default templates;
