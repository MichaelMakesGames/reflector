import { Entity } from "../../types/Entity";
import {
  GRAY,
  PRIORITY_TERRAIN,
  WHITE,
  PURPLE,
  PRIORITY_FLOOR,
  DARK_GRAY,
} from "../../constants";

const templates: { [id: string]: Partial<Entity> } = {
  WALL: {
    glyph: { glyph: "#", color: GRAY, priority: PRIORITY_TERRAIN },
    blocking: { throwing: true, moving: true },
  },
  FLOOR: {
    glyph: { glyph: ".", color: DARK_GRAY, priority: PRIORITY_FLOOR },
  },
  STAIRS: {
    glyph: { glyph: "<", color: WHITE, priority: PRIORITY_TERRAIN },
    stairs: {},
  },
  TELEPORTER: {
    glyph: { glyph: "◉", color: PURPLE, priority: PRIORITY_TERRAIN },
    teleporter: {},
  },
};

export default templates;
