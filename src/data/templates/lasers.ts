import { PRIORITY_LASER, UP } from "~/constants";
import colors from "~colors";
import { Entity } from "~types";

const templates: Partial<Record<TemplateName, Partial<Entity>>> = {
  LASER_BASE: {
    laser: {
      cosmetic: false,
      hit: false,
      strength: 1,
      direction: UP,
    },
  },
  LASER_COSMETIC_BASE: {
    laser: {
      cosmetic: true,
      hit: false,
      strength: 1,
      direction: UP,
    },
  },
  LASER_BURST: {
    parentTemplate: "LASER_BASE",
    display: {
      glyph: "*",
      tile: "laser_burst",
      color: colors.laser,
      priority: PRIORITY_LASER,
    },
  },
  LASER_HORIZONTAL_THIN: {
    parentTemplate: "LASER_BASE",
    display: {
      glyph: "─",
      tile: "laser_thin",
      color: colors.laser,
      priority: PRIORITY_LASER,
    },
  },
  LASER_HORIZONTAL_MEDIUM: {
    parentTemplate: "LASER_BASE",
    display: {
      glyph: "═",
      tile: "laser_medium",
      color: colors.laser,
      priority: PRIORITY_LASER,
    },
  },
  LASER_HORIZONTAL_THICK: {
    parentTemplate: "LASER_BASE",
    display: {
      glyph: "━",
      tile: "laser_thick",
      color: colors.laser,
      priority: PRIORITY_LASER,
    },
  },
  LASER_VERTICAL_THIN: {
    parentTemplate: "LASER_BASE",
    display: {
      glyph: "│",
      tile: "laser_thin",
      color: colors.laser,
      priority: PRIORITY_LASER,
      rotation: 90,
    },
  },
  LASER_VERTICAL_MEDIUM: {
    parentTemplate: "LASER_BASE",
    display: {
      glyph: "║",
      tile: "laser_medium",
      color: colors.laser,
      priority: PRIORITY_LASER,
      rotation: 90,
    },
  },
  LASER_VERTICAL_THICK: {
    parentTemplate: "LASER_BASE",
    display: {
      glyph: "┃",
      tile: "laser_thick",
      color: colors.laser,
      priority: PRIORITY_LASER,
      rotation: 90,
    },
  },
  LASER_REFLECTED_THIN_UP_LEFT: {
    parentTemplate: "LASER_COSMETIC_BASE",
    display: {
      glyph: "",
      tile: "laser_reflected_thin",
      rotation: 180,
      color: colors.laser,
      priority: PRIORITY_LASER,
    },
  },
  LASER_REFLECTED_THIN_UP_RIGHT: {
    parentTemplate: "LASER_COSMETIC_BASE",
    display: {
      glyph: "",
      tile: "laser_reflected_thin",
      rotation: 270,
      color: colors.laser,
      priority: PRIORITY_LASER,
    },
  },
  LASER_REFLECTED_THIN_DOWN_LEFT: {
    parentTemplate: "LASER_COSMETIC_BASE",
    display: {
      glyph: "",
      tile: "laser_reflected_thin",
      rotation: 90,
      color: colors.laser,
      priority: PRIORITY_LASER,
    },
  },
  LASER_REFLECTED_THIN_DOWN_RIGHT: {
    parentTemplate: "LASER_COSMETIC_BASE",
    display: {
      glyph: "",
      tile: "laser_reflected_thin",
      rotation: 0,
      color: colors.laser,
      priority: PRIORITY_LASER,
    },
  },
  LASER_REFLECTED_MEDIUM_UP_LEFT: {
    parentTemplate: "LASER_COSMETIC_BASE",
    display: {
      glyph: "",
      tile: "laser_reflected_medium",
      rotation: 180,
      color: colors.laser,
      priority: PRIORITY_LASER,
    },
  },
  LASER_REFLECTED_MEDIUM_UP_RIGHT: {
    parentTemplate: "LASER_COSMETIC_BASE",
    display: {
      glyph: "",
      tile: "laser_reflected_medium",
      rotation: 270,
      color: colors.laser,
      priority: PRIORITY_LASER,
    },
  },
  LASER_REFLECTED_MEDIUM_DOWN_LEFT: {
    parentTemplate: "LASER_COSMETIC_BASE",
    display: {
      glyph: "",
      tile: "laser_reflected_medium",
      rotation: 90,
      color: colors.laser,
      priority: PRIORITY_LASER,
    },
  },
  LASER_REFLECTED_MEDIUM_DOWN_RIGHT: {
    parentTemplate: "LASER_COSMETIC_BASE",
    display: {
      glyph: "",
      tile: "laser_reflected_medium",
      rotation: 0,
      color: colors.laser,
      priority: PRIORITY_LASER,
    },
  },
  LASER_REFLECTED_THICK_UP_LEFT: {
    parentTemplate: "LASER_COSMETIC_BASE",
    display: {
      glyph: "",
      tile: "laser_reflected_thick",
      rotation: 180,
      color: colors.laser,
      priority: PRIORITY_LASER,
    },
  },
  LASER_REFLECTED_THICK_UP_RIGHT: {
    parentTemplate: "LASER_COSMETIC_BASE",
    display: {
      glyph: "",
      tile: "laser_reflected_thick",
      rotation: 270,
      color: colors.laser,
      priority: PRIORITY_LASER,
    },
  },
  LASER_REFLECTED_THICK_DOWN_LEFT: {
    parentTemplate: "LASER_COSMETIC_BASE",
    display: {
      glyph: "",
      tile: "laser_reflected_thick",
      rotation: 90,
      color: colors.laser,
      priority: PRIORITY_LASER,
    },
  },
  LASER_REFLECTED_THICK_DOWN_RIGHT: {
    parentTemplate: "LASER_COSMETIC_BASE",
    display: {
      glyph: "",
      tile: "laser_reflected_thick",
      rotation: 0,
      color: colors.laser,
      priority: PRIORITY_LASER,
    },
  },
  LASER_4SPLIT_THIN_TO_THIN: {
    parentTemplate: "LASER_COSMETIC_BASE",
    display: {
      glyph: "",
      tile: "laser_4split_thin_to_thin",
      rotation: 0,
      color: colors.laser,
      priority: PRIORITY_LASER,
    },
  },
  LASER_SPLIT_THIN_TO_NONE_UP: {
    parentTemplate: "LASER_COSMETIC_BASE",
    display: {
      glyph: "",
      tile: "laser_split_thin_to_none",
      rotation: 0,
      color: colors.laser,
      priority: PRIORITY_LASER,
    },
  },
  LASER_SPLIT_THIN_TO_NONE_RIGHT: {
    parentTemplate: "LASER_COSMETIC_BASE",
    display: {
      glyph: "",
      tile: "laser_split_thin_to_none",
      rotation: 90,
      color: colors.laser,
      priority: PRIORITY_LASER,
    },
  },
  LASER_SPLIT_THIN_TO_NONE_DOWN: {
    parentTemplate: "LASER_COSMETIC_BASE",
    display: {
      glyph: "",
      tile: "laser_split_thin_to_none",
      rotation: 180,
      color: colors.laser,
      priority: PRIORITY_LASER,
    },
  },
  LASER_SPLIT_THIN_TO_NONE_LEFT: {
    parentTemplate: "LASER_COSMETIC_BASE",
    display: {
      glyph: "",
      tile: "laser_split_thin_to_none",
      rotation: 270,
      color: colors.laser,
      priority: PRIORITY_LASER,
    },
  },
  LASER_SPLIT_MEDIUM_TO_THIN_UP: {
    parentTemplate: "LASER_COSMETIC_BASE",
    display: {
      glyph: "",
      tile: "laser_split_medium_to_thin",
      rotation: 0,
      color: colors.laser,
      priority: PRIORITY_LASER,
    },
  },
  LASER_SPLIT_MEDIUM_TO_THIN_RIGHT: {
    parentTemplate: "LASER_COSMETIC_BASE",
    display: {
      glyph: "",
      tile: "laser_split_medium_to_thin",
      rotation: 90,
      color: colors.laser,
      priority: PRIORITY_LASER,
    },
  },
  LASER_SPLIT_MEDIUM_TO_THIN_DOWN: {
    parentTemplate: "LASER_COSMETIC_BASE",
    display: {
      glyph: "",
      tile: "laser_split_medium_to_thin",
      rotation: 180,
      color: colors.laser,
      priority: PRIORITY_LASER,
    },
  },
  LASER_SPLIT_MEDIUM_TO_THIN_LEFT: {
    parentTemplate: "LASER_COSMETIC_BASE",
    display: {
      glyph: "",
      tile: "laser_split_medium_to_thin",
      rotation: 270,
      color: colors.laser,
      priority: PRIORITY_LASER,
    },
  },
  LASER_SPLIT_THICK_TO_MEDIUM_UP: {
    parentTemplate: "LASER_COSMETIC_BASE",
    display: {
      glyph: "",
      tile: "laser_split_thick_to_medium",
      rotation: 0,
      color: colors.laser,
      priority: PRIORITY_LASER,
    },
  },
  LASER_SPLIT_THICK_TO_MEDIUM_RIGHT: {
    parentTemplate: "LASER_COSMETIC_BASE",
    display: {
      glyph: "",
      tile: "laser_split_thick_to_medium",
      rotation: 90,
      color: colors.laser,
      priority: PRIORITY_LASER,
    },
  },
  LASER_SPLIT_THICK_TO_MEDIUM_DOWN: {
    parentTemplate: "LASER_COSMETIC_BASE",
    display: {
      glyph: "",
      tile: "laser_split_thick_to_medium",
      rotation: 180,
      color: colors.laser,
      priority: PRIORITY_LASER,
    },
  },
  LASER_SPLIT_THICK_TO_MEDIUM_LEFT: {
    parentTemplate: "LASER_COSMETIC_BASE",
    display: {
      glyph: "",
      tile: "laser_split_thick_to_medium",
      rotation: 270,
      color: colors.laser,
      priority: PRIORITY_LASER,
    },
  },
  LASER_SPLIT_THICK_TO_THICK_UP: {
    parentTemplate: "LASER_COSMETIC_BASE",
    display: {
      glyph: "",
      tile: "laser_split_thick_to_thick",
      rotation: 0,
      color: colors.laser,
      priority: PRIORITY_LASER,
    },
  },
  LASER_SPLIT_THICK_TO_THICK_RIGHT: {
    parentTemplate: "LASER_COSMETIC_BASE",
    display: {
      glyph: "",
      tile: "laser_split_thick_to_thick",
      rotation: 90,
      color: colors.laser,
      priority: PRIORITY_LASER,
    },
  },
  LASER_SPLIT_THICK_TO_THICK_DOWN: {
    parentTemplate: "LASER_COSMETIC_BASE",
    display: {
      glyph: "",
      tile: "laser_split_thick_to_thick",
      rotation: 180,
      color: colors.laser,
      priority: PRIORITY_LASER,
    },
  },
  LASER_SPLIT_THICK_TO_THICK_LEFT: {
    parentTemplate: "LASER_COSMETIC_BASE",
    display: {
      glyph: "",
      tile: "laser_split_thick_to_thick",
      rotation: 270,
      color: colors.laser,
      priority: PRIORITY_LASER,
    },
  },
  LASER_SPLIT_THIN_TO_THIN_UP: {
    parentTemplate: "LASER_COSMETIC_BASE",
    display: {
      glyph: "",
      tile: "laser_split_thin_to_thin",
      rotation: 0,
      color: colors.laser,
      priority: PRIORITY_LASER,
    },
  },
  LASER_SPLIT_THIN_TO_THIN_RIGHT: {
    parentTemplate: "LASER_COSMETIC_BASE",
    display: {
      glyph: "",
      tile: "laser_split_thin_to_thin",
      rotation: 90,
      color: colors.laser,
      priority: PRIORITY_LASER,
    },
  },
  LASER_SPLIT_THIN_TO_THIN_DOWN: {
    parentTemplate: "LASER_COSMETIC_BASE",
    display: {
      glyph: "",
      tile: "laser_split_thin_to_thin",
      rotation: 180,
      color: colors.laser,
      priority: PRIORITY_LASER,
    },
  },
  LASER_SPLIT_THIN_TO_THIN_LEFT: {
    parentTemplate: "LASER_COSMETIC_BASE",
    display: {
      glyph: "",
      tile: "laser_split_thin_to_thin",
      rotation: 270,
      color: colors.laser,
      priority: PRIORITY_LASER,
    },
  },
};

export default templates;
