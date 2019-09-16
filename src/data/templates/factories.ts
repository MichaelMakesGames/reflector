import { Entity } from "../../types/Entity";
import { BLUE, PRIORITY_ENEMY } from "../../constants";

const templates: { [id: string]: Partial<Entity> } = {
  FACTORY_BASE: {
    destructible: {},
    cooldown: { time: 0 },
    blocking: { moving: true, throwing: true },
    display: {
      glyph: "F",
      tile: "factory",
      color: BLUE,
      priority: PRIORITY_ENEMY,
    },
  },
  FACTORY_RUSHER: {
    parentTemplate: "FACTORY_BASE",
    factory: { type: "ENEMY_RUSHER", cooldown: 2 },
  },
  FACTORY_ANGLER: {
    parentTemplate: "FACTORY_BASE",
    factory: { type: "ENEMY_ANGLER", cooldown: 2 },
  },
  FACTORY_SMASHER: {
    parentTemplate: "FACTORY_BASE",
    factory: { type: "ENEMY_SMASHER", cooldown: 2 },
  },
  FACTORY_BOMBER: {
    parentTemplate: "FACTORY_BASE",
    factory: { type: "ENEMY_BOMBER", cooldown: 2 },
  },
};

export default templates;
