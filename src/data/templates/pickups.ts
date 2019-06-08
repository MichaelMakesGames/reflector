import {
  RED,
  PRIORITY_ITEM,
  GREEN,
  WHITE,
  PRIORITY_THROWING,
  TILE_SIZE,
} from "../../constants";
import { Entity } from "../../types/Entity";

const templates: { [id: string]: Partial<Entity> } = {
  MED_KIT: {
    display: {
      tile: "item_medkit",
      glyph: "✚",
      color: RED,
      priority: PRIORITY_ITEM,
    },
    pickup: { effect: "HEAL" },
  },
  RECHARGE_KIT: {
    display: {
      tile: "item_recharge",
      glyph: "⇮",
      color: GREEN,
      priority: PRIORITY_ITEM,
    },
    pickup: { effect: "RECHARGE" },
  },
  REFLECTOR_BASE: {
    blocking: { throwing: false, moving: true },
    destructible: {},
    pickup: { effect: "PICKUP" },
  },
  REFLECTOR_UP_RIGHT: {
    parentTemplate: "REFLECTOR_BASE",
    display: {
      tile: "reflector_1",
      glyph: "/",
      color: WHITE,
      priority: PRIORITY_THROWING,
    },
    reflector: { type: "/" },
  },
  REFLECTOR_DOWN_RIGHT: {
    parentTemplate: "REFLECTOR_BASE",
    display: {
      tile: "reflector_2",
      glyph: "\\",
      color: WHITE,
      priority: PRIORITY_THROWING,
    },
    reflector: { type: "\\" },
  },
  SPLITTER_BASE: {
    blocking: { throwing: false, moving: true },
    destructible: {},
    pickup: { effect: "PICKUP" },
  },
  SPLITTER_HORIZONTAL: {
    parentTemplate: "SPLITTER_BASE",
    display: {
      tile: "splitter_1",
      glyph: "⬌",
      color: WHITE,
      priority: PRIORITY_THROWING,
    },
    splitter: { type: "horizontal" },
  },
  SPLITTER_VERTICAL: {
    parentTemplate: "SPLITTER_BASE",
    display: {
      tile: "splitter_2",
      glyph: "⬍",
      color: WHITE,
      priority: PRIORITY_THROWING,
    },
    splitter: { type: "vertical" },
  },
};

export default templates;
