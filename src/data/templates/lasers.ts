import { Entity } from "../../types";
import { PRIORITY_LASER, RED } from "../../constants";

const templates: { [id: string]: Partial<Entity> } = {
  LASER_BASE: {
    targeting: {},
  },
  LASER_BURST: {
    parentTemplate: "LASER_BASE",
    display: {
      glyph: "*",
      tile: "laser_burst",
      color: RED,
      priority: PRIORITY_LASER,
    },
  },
  LASER_HORIZONTAL_THIN: {
    parentTemplate: "LASER_BASE",
    display: {
      glyph: "─",
      tile: "laser_horizontal_thin",
      color: RED,
      priority: PRIORITY_LASER,
    },
  },
  LASER_HORIZONTAL_MEDIUM: {
    parentTemplate: "LASER_BASE",
    display: {
      glyph: "═",
      tile: "laser_horizontal_medium",
      color: RED,
      priority: PRIORITY_LASER,
    },
  },
  LASER_HORIZONTAL_THICK: {
    parentTemplate: "LASER_BASE",
    display: {
      glyph: "━",
      tile: "laser_horizontal_thick",
      color: RED,
      priority: PRIORITY_LASER,
    },
  },
  LASER_VERTICAL_THIN: {
    parentTemplate: "LASER_BASE",
    display: {
      glyph: "│",
      tile: "laser_vertical_thin",
      color: RED,
      priority: PRIORITY_LASER,
    },
  },
  LASER_VERTICAL_MEDIUM: {
    parentTemplate: "LASER_BASE",
    display: {
      glyph: "║",
      tile: "laser_vertical_medium",
      color: RED,
      priority: PRIORITY_LASER,
    },
  },
  LASER_VERTICAL_THICK: {
    parentTemplate: "LASER_BASE",
    display: {
      glyph: "┃",
      tile: "laser_vertical_thick",
      color: RED,
      priority: PRIORITY_LASER,
    },
  },
};

export default templates;
