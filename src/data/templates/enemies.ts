import colors from "~colors";
import { Entity } from "~types";
import { PRIORITY_UNIT } from "~constants";

const templates: Partial<Record<TemplateName, Partial<Entity>>> = {
  ENEMY_BASE: {
    blocking: { moving: true, lasers: true, windmill: false },
    destructible: {},
    conductive: {},
  },
  ENEMY_DRONE: {
    parentTemplate: "ENEMY_BASE",
    display: {
      tile: "enemy_drone",
      color: colors.enemyUnit,
      priority: PRIORITY_UNIT,
    },
    ai: { type: "DRONE" },
    description: {
      name: "Drone",
      description:
        "The most basic enemy. It targets the player or nearest building.",
    },
  },
};

export default templates;
