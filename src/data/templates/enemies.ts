import { Entity } from "~/types/Entity";
import { PRIORITY_ENEMY, GREEN } from "~/constants";

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
      color: GREEN,
      priority: PRIORITY_ENEMY,
    },
    ai: { type: "DRONE" },
  },
};

export default templates;
