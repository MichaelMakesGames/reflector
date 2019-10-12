import {
  DARK_GRAY,
  PRIORITY_FLOOR,
  PRIORITY_TERRAIN,
  BLUE,
  GRAY,
} from "~/constants";
import { Entity } from "~/types/Entity";

const templates: { [id: string]: Partial<Entity> } = {
  FLOOR: {
    display: {
      tile: "floor",
      glyph: ".",
      color: DARK_GRAY,
      priority: PRIORITY_FLOOR,
    },
  },
  WATER: {
    display: {
      tile: "water",
      glyph: "~",
      color: BLUE,
      priority: PRIORITY_FLOOR,
    },
    blocking: {
      moving: true,
      lasers: false,
    },
  },
  MOUNTAIN: {
    display: {
      tile: "mountain",
      glyph: "▲",
      color: GRAY,
      priority: PRIORITY_FLOOR,
    },
    blocking: {
      moving: true,
      lasers: true,
    },
  },
};

export default templates;
