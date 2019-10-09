import { PRIORITY_ITEM, PRIORITY_PLACING, WHITE } from "~/constants";
import { Entity } from "~/types/Entity";
import { reduceMorale } from "~state/actions";

const templates: { [id: string]: Partial<Entity> } = {
  REFLECTOR_BASE: {},
  REFLECTOR_UP_RIGHT: {
    parentTemplate: "REFLECTOR_BASE",
    display: {
      tile: "reflector_1",
      glyph: "/",
      color: WHITE,
      priority: PRIORITY_PLACING,
    },
    reflector: { type: "/" },
  },
  REFLECTOR_DOWN_RIGHT: {
    parentTemplate: "REFLECTOR_BASE",
    display: {
      tile: "reflector_2",
      glyph: "\\",
      color: WHITE,
      priority: PRIORITY_PLACING,
    },
    reflector: { type: "\\" },
  },
  SPLITTER_BASE: {
    blocking: { moving: true },
    destructible: {},
  },
  SPLITTER_HORIZONTAL: {
    parentTemplate: "SPLITTER_BASE",
    display: {
      tile: "splitter_1",
      glyph: "⬌",
      color: WHITE,
      priority: PRIORITY_PLACING,
    },
    splitter: { type: "horizontal" },
  },
  SPLITTER_VERTICAL: {
    parentTemplate: "SPLITTER_BASE",
    display: {
      tile: "splitter_2",
      glyph: "⬍",
      color: WHITE,
      priority: PRIORITY_PLACING,
    },
    splitter: { type: "vertical" },
  },
  TENT: {
    display: {
      tile: "tent",
      glyph: "▲",
      color: WHITE,
      priority: PRIORITY_ITEM,
    },
    blocking: {
      moving: true,
    },
    housing: {
      capacity: 1,
      occupancy: 1,
    },
    destructible: {
      onDestroy: entity => {
        if (entity.housing) {
          return reduceMorale({ amount: entity.housing.occupancy });
        }
        return null;
      },
    },
  },
  WALL: {
    display: {
      tile: "wall",
      glyph: "#",
      color: WHITE,
      priority: PRIORITY_ITEM,
    },
    blocking: {
      moving: true,
    },
    destructible: {},
  },
};

export default templates;
