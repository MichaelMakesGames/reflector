import colors from "~colors";
import { Entity } from "~types";
import { PRIORITY_UNIT } from "~constants";

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
      description: "A bug that digs underground until ready to attack.",
      shortDescription: "digging enemy",
    },
  },
  ENEMY_BURROWED: {
    parentTemplate: "ENEMY_BASE",
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
