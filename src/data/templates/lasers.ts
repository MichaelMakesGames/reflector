import { PRIORITY_LASER, UP } from "../../constants";
import colors from "../../colors";
import { Entity } from "../../types";
import { TemplateName } from "../../types/TemplateName";

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
  LASER_PLAYER_UP: {
    parentTemplate: "LASER_COSMETIC_BASE",
    display: {
      tile: "laser_player_up",
      color: colors.laser,
      priority: PRIORITY_LASER,
    },
  },
  LASER_PLAYER_DOWN: {
    parentTemplate: "LASER_COSMETIC_BASE",
    display: {
      tile: "laser_player_down",
      color: colors.laser,
      priority: PRIORITY_LASER,
    },
  },
  LASER_PLAYER_LEFT: {
    parentTemplate: "LASER_COSMETIC_BASE",
    display: {
      tile: "laser_player_left",
      color: colors.laser,
      priority: PRIORITY_LASER,
    },
  },
  LASER_PLAYER_RIGHT: {
    parentTemplate: "LASER_COSMETIC_BASE",
    display: {
      tile: "laser_player_right",
      color: colors.laser,
      priority: PRIORITY_LASER,
    },
  },
  LASER_BURST: {
    parentTemplate: "LASER_BASE",
    display: {
      tile: "laser_burst",
      color: colors.laser,
      priority: PRIORITY_LASER,
    },
  },
  LASER_HORIZONTAL: {
    parentTemplate: "LASER_BASE",
    display: {
      tile: "laser",
      color: colors.laser,
      priority: PRIORITY_LASER,
    },
  },
  LASER_VERTICAL: {
    parentTemplate: "LASER_BASE",
    display: {
      tile: "laser",
      color: colors.laser,
      priority: PRIORITY_LASER,
      rotation: 90,
    },
  },
  LASER_REFLECTED_UP_LEFT: {
    parentTemplate: "LASER_COSMETIC_BASE",
    display: {
      tile: "laser_reflected",
      rotation: 180,
      color: colors.laser,
      priority: PRIORITY_LASER,
    },
  },
  LASER_REFLECTED_UP_RIGHT: {
    parentTemplate: "LASER_COSMETIC_BASE",
    display: {
      tile: "laser_reflected",
      rotation: 270,
      color: colors.laser,
      priority: PRIORITY_LASER,
    },
  },
  LASER_REFLECTED_DOWN_LEFT: {
    parentTemplate: "LASER_COSMETIC_BASE",
    display: {
      tile: "laser_reflected",
      rotation: 90,
      color: colors.laser,
      priority: PRIORITY_LASER,
    },
  },
  LASER_REFLECTED_DOWN_RIGHT: {
    parentTemplate: "LASER_COSMETIC_BASE",
    display: {
      tile: "laser_reflected",
      rotation: 0,
      color: colors.laser,
      priority: PRIORITY_LASER,
    },
  },
  LASER_4SPLIT: {
    parentTemplate: "LASER_COSMETIC_BASE",
    display: {
      tile: "laser_4split",
      rotation: 0,
      color: colors.laser,
      priority: PRIORITY_LASER,
    },
  },
  LASER_SPLIT_UP: {
    parentTemplate: "LASER_COSMETIC_BASE",
    display: {
      tile: "laser_split",
      rotation: 0,
      color: colors.laser,
      priority: PRIORITY_LASER,
    },
  },
  LASER_SPLIT_RIGHT: {
    parentTemplate: "LASER_COSMETIC_BASE",
    display: {
      tile: "laser_split",
      rotation: 90,
      color: colors.laser,
      priority: PRIORITY_LASER,
    },
  },
  LASER_SPLIT_DOWN: {
    parentTemplate: "LASER_COSMETIC_BASE",
    display: {
      tile: "laser_split",
      rotation: 180,
      color: colors.laser,
      priority: PRIORITY_LASER,
    },
  },
  LASER_SPLIT_LEFT: {
    parentTemplate: "LASER_COSMETIC_BASE",
    display: {
      tile: "laser_split",
      rotation: 270,
      color: colors.laser,
      priority: PRIORITY_LASER,
    },
  },
};

export default templates;
