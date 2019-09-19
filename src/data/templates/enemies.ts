import { Entity } from "~/types/Entity";
import { BLUE, PRIORITY_ENEMY } from "~/constants";

const templates: { [id: string]: Partial<Entity> } = {
  ENEMY_BASE: {
    blocking: { throwing: false, moving: true },
    destructible: {},
    conductive: {},
  },
  ENEMY_RUSHER: {
    parentTemplate: "ENEMY_BASE",
    display: {
      tile: "enemy1",
      glyph: "R",
      color: BLUE,
      priority: PRIORITY_ENEMY,
    },
    ai: { type: "RUSHER" },
  },
};

export default templates;
