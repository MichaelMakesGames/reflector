import { DARK_GRAY, PRIORITY_FLOOR, PRIORITY_TERRAIN } from "~/constants";
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
};

export default templates;
