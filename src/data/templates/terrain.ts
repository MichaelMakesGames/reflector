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
  WALL_BASE: {
    blocking: { throwing: true, moving: true },
  },
  WALL_0: {
    parentTemplate: "WALL_BASE",
    display: {
      tile: "wall_0",
      glyph: "#",
      color: GRAY,
      priority: PRIORITY_TERRAIN,
    },
  },
  WALL_1: {
    parentTemplate: "WALL_BASE",
    display: {
      tile: "wall_1",
      glyph: "#",
      color: GRAY,
      priority: PRIORITY_TERRAIN,
    },
  },
  WALL_2: {
    parentTemplate: "WALL_BASE",
    display: {
      tile: "wall_2",
      glyph: "#",
      color: GRAY,
      priority: PRIORITY_TERRAIN,
    },
  },
  WALL_3: {
    parentTemplate: "WALL_BASE",
    display: {
      tile: "wall_3",
      glyph: "#",
      color: GRAY,
      priority: PRIORITY_TERRAIN,
    },
  },
  WALL_4: {
    parentTemplate: "WALL_BASE",
    display: {
      tile: "wall_4",
      glyph: "#",
      color: GRAY,
      priority: PRIORITY_TERRAIN,
    },
  },
  WALL_5: {
    parentTemplate: "WALL_BASE",
    display: {
      tile: "wall_5",
      glyph: "#",
      color: GRAY,
      priority: PRIORITY_TERRAIN,
    },
  },
  WALL_6: {
    parentTemplate: "WALL_BASE",
    display: {
      tile: "wall_6",
      glyph: "#",
      color: GRAY,
      priority: PRIORITY_TERRAIN,
    },
  },
  WALL_7: {
    parentTemplate: "WALL_BASE",
    display: {
      tile: "wall_7",
      glyph: "#",
      color: GRAY,
      priority: PRIORITY_TERRAIN,
    },
  },
  WALL_8: {
    parentTemplate: "WALL_BASE",
    display: {
      tile: "wall_8",
      glyph: "#",
      color: GRAY,
      priority: PRIORITY_TERRAIN,
    },
  },
  WALL_9: {
    parentTemplate: "WALL_BASE",
    display: {
      tile: "wall_9",
      glyph: "#",
      color: GRAY,
      priority: PRIORITY_TERRAIN,
    },
  },
  WALL_10: {
    parentTemplate: "WALL_BASE",
    display: {
      tile: "wall_10",
      glyph: "#",
      color: GRAY,
      priority: PRIORITY_TERRAIN,
    },
  },
  WALL_11: {
    parentTemplate: "WALL_BASE",
    display: {
      tile: "wall_11",
      glyph: "#",
      color: GRAY,
      priority: PRIORITY_TERRAIN,
    },
  },
  WALL_12: {
    parentTemplate: "WALL_BASE",
    display: {
      tile: "wall_12",
      glyph: "#",
      color: GRAY,
      priority: PRIORITY_TERRAIN,
    },
  },
  WALL_13: {
    parentTemplate: "WALL_BASE",
    display: {
      tile: "wall_13",
      glyph: "#",
      color: GRAY,
      priority: PRIORITY_TERRAIN,
    },
  },
  WALL_14: {
    parentTemplate: "WALL_BASE",
    display: {
      tile: "wall_14",
      glyph: "#",
      color: GRAY,
      priority: PRIORITY_TERRAIN,
    },
  },
  WALL_15: {
    parentTemplate: "WALL_BASE",
    display: {
      tile: "wall_15",
      glyph: "#",
      color: GRAY,
      priority: PRIORITY_TERRAIN,
    },
  },
  FLOOR: {
    display: {
      tile: "floor",
      glyph: ".",
      color: DARK_GRAY,
      priority: PRIORITY_FLOOR,
    },
  },
  STAIRS: {
    display: {
      tile: "stairs_down",
      glyph: "<",
      color: WHITE,
      priority: PRIORITY_TERRAIN,
    },
    stairs: {},
  },
  TELEPORTER: {
    display: {
      tile: "teleporter",
      glyph: "◉",
      color: PURPLE,
      priority: PRIORITY_TERRAIN,
    },
    teleporter: {},
  },
};

export default templates;
