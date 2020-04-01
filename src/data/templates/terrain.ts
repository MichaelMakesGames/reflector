import { PRIORITY_TERRAIN } from "~/constants";
import colors from "~colors";
import { Entity } from "~types";

const templates: Partial<Record<TemplateName, Partial<Entity>>> = {
  FLOOR: {
    display: {
      tile: "floor",
      glyph: ".",
      color: colors.ground,
      priority: PRIORITY_TERRAIN,
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
      priority: PRIORITY_TERRAIN,
    },
  },
  WATER_1: {
    parentTemplate: "WATER_BASE",
    display: {
      tile: "water_4",
      rotation: 180,
      glyph: "~",
      color: colors.water,
      priority: PRIORITY_TERRAIN,
    },
  },
  WATER_2: {
    parentTemplate: "WATER_BASE",
    display: {
      tile: "water_4",
      rotation: 270,
      glyph: "~",
      color: colors.water,
      priority: PRIORITY_TERRAIN,
    },
  },
  WATER_3: {
    parentTemplate: "WATER_BASE",
    display: {
      tile: "water_6",
      rotation: 270,
      glyph: "~",
      color: colors.water,
      priority: PRIORITY_TERRAIN,
    },
  },
  WATER_4: {
    parentTemplate: "WATER_BASE",
    display: {
      tile: "water_4",
      glyph: "~",
      color: colors.water,
      priority: PRIORITY_TERRAIN,
    },
  },
  WATER_5: {
    parentTemplate: "WATER_BASE",
    display: {
      tile: "water_5",
      glyph: "~",
      color: colors.water,
      priority: PRIORITY_TERRAIN,
    },
  },
  WATER_6: {
    parentTemplate: "WATER_BASE",
    display: {
      tile: "water_6",
      glyph: "~",
      color: colors.water,
      priority: PRIORITY_TERRAIN,
    },
  },
  WATER_7: {
    parentTemplate: "WATER_BASE",
    display: {
      tile: "water_7",
      glyph: "~",
      color: colors.water,
      priority: PRIORITY_TERRAIN,
    },
  },
  WATER_8: {
    parentTemplate: "WATER_BASE",
    display: {
      tile: "water_4",
      rotation: 90,
      glyph: "~",
      color: colors.water,
      priority: PRIORITY_TERRAIN,
    },
  },
  WATER_9: {
    parentTemplate: "WATER_BASE",
    display: {
      tile: "water_6",
      rotation: 180,
      glyph: "~",
      color: colors.water,
      priority: PRIORITY_TERRAIN,
    },
  },
  WATER_10: {
    parentTemplate: "WATER_BASE",
    display: {
      tile: "water_5",
      rotation: 90,
      glyph: "~",
      color: colors.water,
      priority: PRIORITY_TERRAIN,
    },
  },
  WATER_11: {
    parentTemplate: "WATER_BASE",
    display: {
      tile: "water_7",
      rotation: 270,
      glyph: "~",
      color: colors.water,
      priority: PRIORITY_TERRAIN,
    },
  },
  WATER_12: {
    parentTemplate: "WATER_BASE",
    display: {
      tile: "water_6",
      rotation: 90,
      glyph: "~",
      color: colors.water,
      priority: PRIORITY_TERRAIN,
    },
  },
  WATER_13: {
    parentTemplate: "WATER_BASE",
    display: {
      tile: "water_7",
      rotation: 180,
      glyph: "~",
      color: colors.water,
      priority: PRIORITY_TERRAIN,
    },
  },
  WATER_14: {
    parentTemplate: "WATER_BASE",
    display: {
      tile: "water_7",
      rotation: 90,
      glyph: "~",
      color: colors.water,
      priority: PRIORITY_TERRAIN,
    },
  },
  WATER_15: {
    parentTemplate: "WATER_BASE",
    display: {
      tile: "water_15",
      glyph: "~",
      color: colors.water,
      priority: PRIORITY_TERRAIN,
    },
  },
  WATER_CORNER_NE: {
    display: {
      tile: "water_corner",
      glyph: "",
      color: colors.water,
      priority: PRIORITY_TERRAIN,
    },
  },
  WATER_CORNER_SE: {
    display: {
      tile: "water_corner",
      rotation: 90,
      glyph: "",
      color: colors.water,
      priority: PRIORITY_TERRAIN,
    },
  },
  WATER_CORNER_SW: {
    display: {
      tile: "water_corner",
      rotation: 180,
      glyph: "",
      color: colors.water,
      priority: PRIORITY_TERRAIN,
    },
  },
  WATER_CORNER_NW: {
    display: {
      tile: "water_corner",
      rotation: 270,
      glyph: "",
      color: colors.water,
      priority: PRIORITY_TERRAIN,
    },
  },
  MOUNTAIN: {
    display: {
      tile: "mountain",
      glyph: "▲",
      color: colors.mountain,
      priority: PRIORITY_TERRAIN,
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
      priority: PRIORITY_TERRAIN,
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
  FERTILE: {
    display: {
      tile: "fertile",
      glyph: '"',
      color: colors.food,
      priority: PRIORITY_TERRAIN,
    },
    mineable: {
      resource: "FOOD",
    },
    description: {
      name: "Fertile Land",
      description: "Can be farmed for food by building a farm on top.",
    },
  },
};

export default templates;
