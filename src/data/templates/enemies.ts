import { Entity } from "~/types/Entity";
import { PRIORITY_ENEMY, PURPLE } from "~/constants";

const templates: { [id: string]: Partial<Entity> } = {
  ENEMY_BASE: {
    blocking: { throwing: false, moving: true },
    destructible: {},
    conductive: {},
  },
  ENEMY_DRONE: {
    parentTemplate: "ENEMY_BASE",
    display: {
      tile: "enemy_drone",
      glyph: "D",
      color: PURPLE,
      priority: PRIORITY_ENEMY,
    },
    ai: { type: "DRONE" },
  },
};

export default templates;
