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
    ai: { type: "DRONE" },
    description: {
      name: "Soldier",
      description:
        "The most basic enemy. It targets the player or nearest building.",
      shortDescription: "basic enemy",
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
    destructible: { onDestroy: "enemyArmored" },
    stopsLaser: {},
    ai: { type: "DRONE" },
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
    ai: { type: "FLYER" },
    description: {
      name: "Flyer",
      description: "A winged bug that can fly over water.",
      shortDescription: "flying enemy",
    },
  },
};

export default templates;
