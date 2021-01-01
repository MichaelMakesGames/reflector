import { PRIORITY_TERRAIN } from "~/constants";
import colors from "~colors";
import { Entity } from "~types";
import { ResourceCode } from "~data/resources";

const templates: Partial<Record<TemplateName, Partial<Entity>>> = {
  FLOOR: {
    display: {
      tile: "floor",
      color: colors.ground,
      priority: PRIORITY_TERRAIN,
    },
  },
  WATER_BASE: {
    blocking: {
      moving: true,
      lasers: false,
      windmill: false,
    },
    description: {
      name: "Water",
      description:
        "Neither you nor enemies can move over water, but your lasers can shoot over it.",
      shortDescription: "blocks movement",
    },
  },
  WATER_0: {
    parentTemplate: "WATER_BASE",
    display: {
      tile: "water_0",
      color: colors.water,
      priority: PRIORITY_TERRAIN,
    },
  },
  WATER_1: {
    parentTemplate: "WATER_BASE",
    display: {
      tile: "water_4",
      rotation: 180,
      color: colors.water,
      priority: PRIORITY_TERRAIN,
    },
  },
  WATER_2: {
    parentTemplate: "WATER_BASE",
    display: {
      tile: "water_4",
      rotation: 270,
      color: colors.water,
      priority: PRIORITY_TERRAIN,
    },
  },
  WATER_3: {
    parentTemplate: "WATER_BASE",
    display: {
      tile: "water_6",
      rotation: 270,
      color: colors.water,
      priority: PRIORITY_TERRAIN,
    },
  },
  WATER_4: {
    parentTemplate: "WATER_BASE",
    display: {
      tile: "water_4",
      color: colors.water,
      priority: PRIORITY_TERRAIN,
    },
  },
  WATER_5: {
    parentTemplate: "WATER_BASE",
    display: {
      tile: "water_5",
      color: colors.water,
      priority: PRIORITY_TERRAIN,
    },
  },
  WATER_6: {
    parentTemplate: "WATER_BASE",
    display: {
      tile: "water_6",
      color: colors.water,
      priority: PRIORITY_TERRAIN,
    },
  },
  WATER_7: {
    parentTemplate: "WATER_BASE",
    display: {
      tile: "water_7",
      color: colors.water,
      priority: PRIORITY_TERRAIN,
    },
  },
  WATER_8: {
    parentTemplate: "WATER_BASE",
    display: {
      tile: "water_4",
      rotation: 90,
      color: colors.water,
      priority: PRIORITY_TERRAIN,
    },
  },
  WATER_9: {
    parentTemplate: "WATER_BASE",
    display: {
      tile: "water_6",
      rotation: 180,
      color: colors.water,
      priority: PRIORITY_TERRAIN,
    },
  },
  WATER_10: {
    parentTemplate: "WATER_BASE",
    display: {
      tile: "water_5",
      rotation: 90,
      color: colors.water,
      priority: PRIORITY_TERRAIN,
    },
  },
  WATER_11: {
    parentTemplate: "WATER_BASE",
    display: {
      tile: "water_7",
      rotation: 270,
      color: colors.water,
      priority: PRIORITY_TERRAIN,
    },
  },
  WATER_12: {
    parentTemplate: "WATER_BASE",
    display: {
      tile: "water_6",
      rotation: 90,
      color: colors.water,
      priority: PRIORITY_TERRAIN,
    },
  },
  WATER_13: {
    parentTemplate: "WATER_BASE",
    display: {
      tile: "water_7",
      rotation: 180,
      color: colors.water,
      priority: PRIORITY_TERRAIN,
    },
  },
  WATER_14: {
    parentTemplate: "WATER_BASE",
    display: {
      tile: "water_7",
      rotation: 90,
      color: colors.water,
      priority: PRIORITY_TERRAIN,
    },
  },
  WATER_15: {
    parentTemplate: "WATER_BASE",
    display: {
      tile: "water_15",
      color: colors.water,
      priority: PRIORITY_TERRAIN,
    },
  },
  WATER_CORNER_NE: {
    display: {
      tile: "water_corner",
      color: colors.water,
      priority: PRIORITY_TERRAIN,
    },
  },
  WATER_CORNER_SE: {
    display: {
      tile: "water_corner",
      rotation: 90,
      color: colors.water,
      priority: PRIORITY_TERRAIN,
    },
  },
  WATER_CORNER_SW: {
    display: {
      tile: "water_corner",
      rotation: 180,
      color: colors.water,
      priority: PRIORITY_TERRAIN,
    },
  },
  WATER_CORNER_NW: {
    display: {
      tile: "water_corner",
      rotation: 270,
      color: colors.water,
      priority: PRIORITY_TERRAIN,
    },
  },
  MOUNTAIN: {
    display: {
      tile: "mountain",
      color: colors.mountain,
      priority: PRIORITY_TERRAIN,
    },
    blocking: {
      moving: true,
      lasers: true,
      windmill: true,
    },
    description: {
      name: "Mountain",
      description: "Indestructible. Blocks all movement and lasers.",
      shortDescription: "indestructible",
    },
  },
  ORE: {
    display: {
      tile: "ore",
      color: colors.mineral,
      priority: PRIORITY_TERRAIN,
    },
    mineable: {
      resource: ResourceCode.Metal,
    },
    description: {
      name: "Ore",
      description:
        "Can be mined either manually or by building on mine on top.",
      shortDescription: "can be mined",
    },
  },
  FERTILE: {
    display: {
      tile: "fertile",
      color: colors.food,
      priority: PRIORITY_TERRAIN,
    },
    mineable: {
      resource: ResourceCode.Food,
    },
    description: {
      name: "Fertile Land",
      description: "Can be farmed for food by building a farm on top.",
      shortDescription: "can be farmed",
    },
  },
};

export default templates;
