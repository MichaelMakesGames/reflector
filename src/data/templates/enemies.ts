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
  ENEMY_ANGLER: {
    parentTemplate: "ENEMY_BASE",
    display: {
      tile: "enemy2",
      glyph: "A",
      color: BLUE,
      priority: PRIORITY_ENEMY,
    },
    ai: { type: "ANGLER" },
  },
  ENEMY_SMASHER: {
    parentTemplate: "ENEMY_BASE",
    display: {
      tile: "enemy3",
      glyph: "S",
      color: BLUE,
      priority: PRIORITY_ENEMY,
    },
    ai: { type: "SMASHER" },
  },
  ENEMY_BOMBER: {
    parentTemplate: "ENEMY_BASE",
    display: {
      tile: "enemy4",
      glyph: "B",
      color: BLUE,
      priority: PRIORITY_ENEMY,
    },
    ai: { type: "BOMBER" },
    cooldown: { time: 0 },
  },
};

export default templates;
