import { Entity } from "../types";
import { BLUE, WHITE, PRIORITY_ENEMY, BLACK } from "../constants";

const templates: { [id: string]: Partial<Entity> } = {
  FACTORY_BASE: {
    destructible: {},
    cooldown: { time: 0 },
    blocking: { moving: true, throwing: true },
  },
  FACTORY_RUSHER: {
    parentTemplate: "FACTORY_BASE",
    glyph: {
      glyph: "R",
      color: BLACK,
      background: BLUE,
      priority: PRIORITY_ENEMY,
    },
    factory: { type: "ENEMY_RUSHER", cooldown: 2 },
  },
  FACTORY_ANGLER: {
    parentTemplate: "FACTORY_BASE",
    glyph: {
      glyph: "A",
      color: BLACK,
      background: BLUE,
      priority: PRIORITY_ENEMY,
    },
    factory: { type: "ENEMY_ANGLER", cooldown: 2 },
  },
  FACTORY_SMASHER: {
    parentTemplate: "FACTORY_BASE",
    glyph: {
      glyph: "S",
      color: BLACK,
      background: BLUE,
      priority: PRIORITY_ENEMY,
    },
    factory: { type: "ENEMY_SMASHER", cooldown: 2 },
  },
  FACTORY_BOMBER: {
    parentTemplate: "FACTORY_BASE",
    glyph: {
      glyph: "B",
      color: BLACK,
      background: BLUE,
      priority: PRIORITY_ENEMY,
    },
    factory: { type: "ENEMY_BOMBER", cooldown: 2 },
  },
};

export default templates;
