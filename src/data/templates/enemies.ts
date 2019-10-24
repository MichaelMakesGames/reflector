import { Entity } from "~/types/Entity";
import { PRIORITY_ENEMY } from "~/constants";
import colors from "~colors";

const templates: { [id: string]: Partial<Entity> } = {
  ENEMY_BASE: {
    blocking: { moving: true, lasers: true },
    destructible: {},
    conductive: {},
  },
  ENEMY_DRONE: {
    parentTemplate: "ENEMY_BASE",
    display: {
      tile: "enemy_drone",
      glyph: "D",
      color: colors.enemyUnit,
      priority: PRIORITY_ENEMY,
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
