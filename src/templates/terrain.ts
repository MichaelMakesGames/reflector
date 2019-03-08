import { Entity } from "../types";
import { GRAY, PRIORITY_TERRAIN, WHITE } from "../constants";

const templates: { [id: string]: Partial<Entity> } = {
  WALL: {
    glyph: { glyph: "#", color: GRAY, priority: PRIORITY_TERRAIN },
    blocking: { throwing: true, moving: true },
  },
  STAIRS: {
    glyph: { glyph: "<", color: WHITE, priority: PRIORITY_TERRAIN },
    stairs: {},
  },
};

export default templates;
