import {
  DARK_GRAY,
  PRIORITY_FLOOR,
  RED_GRAY,
  DARK_BLUE,
  ORANGE,
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
      color: DARK_BLUE,
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
      color: RED_GRAY,
      priority: PRIORITY_FLOOR,
    },
    blocking: {
      moving: true,
      lasers: true,
    },
  },
  ORE: {
    display: {
      tile: "ore",
      glyph: ".",
      color: ORANGE,
      priority: PRIORITY_FLOOR,
    },
    mineable: {
      resource: "METAL",
    },
  },
};

export default templates;
