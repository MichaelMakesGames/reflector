import { PRIORITY_FLOOR } from "~/constants";
import { Entity } from "~/types/Entity";
import colors from "~colors";

const templates: { [id: string]: Partial<Entity> } = {
  FLOOR: {
    display: {
      tile: "floor",
      glyph: ".",
      color: colors.ground,
      priority: PRIORITY_FLOOR,
    },
  },
  WATER: {
    display: {
      tile: "water",
      glyph: "~",
      color: colors.water,
      priority: PRIORITY_FLOOR,
    },
    blocking: {
      moving: true,
      lasers: false,
    },
    description: {
      name: "Water",
      description:
        "Neither you nor enemies can move over water, but your lasers can shoot over it.",
    },
  },
  MOUNTAIN: {
    display: {
      tile: "mountain",
      glyph: "▲",
      color: colors.mountain,
      priority: PRIORITY_FLOOR,
    },
    blocking: {
      moving: true,
      lasers: true,
    },
    description: {
      name: "Mountain",
      description: "Indestructible. Blocks all movement and lasers.",
    },
  },
  ORE: {
    display: {
      tile: "ore",
      glyph: ".",
      color: colors.mineral,
      priority: PRIORITY_FLOOR,
    },
    mineable: {
      resource: "METAL",
    },
    description: {
      name: "Ore",
      description:
        "Can be mined either manually or by building on mine on top.",
    },
  },
};

export default templates;
