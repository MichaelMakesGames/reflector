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
      name: "Bug",
      description:
        "The most basic enemy. It targets the player or nearest building.",
    },
  },
};

export default templates;
