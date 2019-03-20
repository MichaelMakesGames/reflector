import { Entity } from "../../types/types";
import { GRAY, PRIORITY_TERRAIN, WHITE, PURPLE } from "../../constants";

const templates: { [id: string]: Partial<Entity> } = {
  WALL: {
    glyph: { glyph: "#", color: GRAY, priority: PRIORITY_TERRAIN },
    blocking: { throwing: true, moving: true },
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
