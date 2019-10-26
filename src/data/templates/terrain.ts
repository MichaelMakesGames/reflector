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
  WATER_BASE: {
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
  WATER_0: {
    parentTemplate: "WATER_BASE",
    display: {
      tile: "water_0",
      glyph: "~",
      color: colors.water,
      priority: PRIORITY_FLOOR,
    },
  },
  WATER_1: {
    parentTemplate: "WATER_BASE",
    display: {
      tile: "water_4",
      rotation: 180,
      glyph: "~",
      color: colors.water,
      priority: PRIORITY_FLOOR,
    },
  },
  WATER_2: {
    parentTemplate: "WATER_BASE",
    display: {
      tile: "water_4",
      rotation: 270,
      glyph: "~",
      color: colors.water,
      priority: PRIORITY_FLOOR,
    },
  },
  WATER_3: {
    parentTemplate: "WATER_BASE",
    display: {
      tile: "water_6",
      rotation: 270,
      glyph: "~",
      color: colors.water,
      priority: PRIORITY_FLOOR,
    },
  },
  WATER_4: {
    parentTemplate: "WATER_BASE",
    display: {
      tile: "water_4",
      glyph: "~",
      color: colors.water,
      priority: PRIORITY_FLOOR,
    },
  },
  WATER_5: {
    parentTemplate: "WATER_BASE",
    display: {
      tile: "water_5",
      glyph: "~",
      color: colors.water,
      priority: PRIORITY_FLOOR,
    },
  },
  WATER_6: {
    parentTemplate: "WATER_BASE",
    display: {
      tile: "water_6",
      glyph: "~",
      color: colors.water,
      priority: PRIORITY_FLOOR,
    },
  },
  WATER_7: {
    parentTemplate: "WATER_BASE",
    display: {
      tile: "water_7",
      glyph: "~",
      color: colors.water,
      priority: PRIORITY_FLOOR,
    },
  },
  WATER_8: {
    parentTemplate: "WATER_BASE",
    display: {
      tile: "water_4",
      rotation: 90,
      glyph: "~",
      color: colors.water,
      priority: PRIORITY_FLOOR,
    },
  },
  WATER_9: {
    parentTemplate: "WATER_BASE",
    display: {
      tile: "water_6",
      rotation: 180,
      glyph: "~",
      color: colors.water,
      priority: PRIORITY_FLOOR,
    },
  },
  WATER_10: {
    parentTemplate: "WATER_BASE",
    display: {
      tile: "water_5",
      rotation: 90,
      glyph: "~",
      color: colors.water,
      priority: PRIORITY_FLOOR,
    },
  },
  WATER_11: {
    parentTemplate: "WATER_BASE",
    display: {
      tile: "water_7",
      rotation: 270,
      glyph: "~",
      color: colors.water,
      priority: PRIORITY_FLOOR,
    },
  },
  WATER_12: {
    parentTemplate: "WATER_BASE",
    display: {
      tile: "water_6",
      rotation: 90,
      glyph: "~",
      color: colors.water,
      priority: PRIORITY_FLOOR,
    },
  },
  WATER_13: {
    parentTemplate: "WATER_BASE",
    display: {
      tile: "water_7",
      rotation: 180,
      glyph: "~",
      color: colors.water,
      priority: PRIORITY_FLOOR,
    },
  },
  WATER_14: {
    parentTemplate: "WATER_BASE",
    display: {
      tile: "water_7",
      rotation: 90,
      glyph: "~",
      color: colors.water,
      priority: PRIORITY_FLOOR,
    },
  },
  WATER_15: {
    parentTemplate: "WATER_BASE",
    display: {
      tile: "water_15",
      glyph: "~",
      color: colors.water,
      priority: PRIORITY_FLOOR,
    },
  },
  WATER_CORNER_NE: {
    display: {
      tile: "water_corner",
      glyph: "",
      color: colors.water,
      priority: PRIORITY_FLOOR,
    },
  },
  WATER_CORNER_SE: {
    display: {
      tile: "water_corner",
      rotation: 90,
      glyph: "",
      color: colors.water,
      priority: PRIORITY_FLOOR,
    },
  },
  WATER_CORNER_SW: {
    display: {
      tile: "water_corner",
      rotation: 180,
      glyph: "",
      color: colors.water,
      priority: PRIORITY_FLOOR,
    },
  },
  WATER_CORNER_NW: {
    display: {
      tile: "water_corner",
      rotation: 270,
      glyph: "",
      color: colors.water,
      priority: PRIORITY_FLOOR,
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
