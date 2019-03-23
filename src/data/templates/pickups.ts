import {
  RED,
  PRIORITY_ITEM,
  GREEN,
  WHITE,
  PRIORITY_THROWING,
} from "../../constants";
import { Entity } from "../../types/Entity";

const templates: { [id: string]: Partial<Entity> } = {
  MED_KIT: {
    glyph: { glyph: "✚", color: RED, priority: PRIORITY_ITEM },
    pickup: { effect: "HEAL" },
  },
  RECHARGE_KIT: {
    glyph: { glyph: "⇮", color: GREEN, priority: PRIORITY_ITEM },
    pickup: { effect: "RECHARGE" },
  },
  REFLECTOR_BASE: {
    blocking: { throwing: false, moving: true },
    destructible: {},
    pickup: { effect: "PICKUP" },
  },
  REFLECTOR_UP_RIGHT: {
    parentTemplate: "REFLECTOR_BASE",
    glyph: { glyph: "/", color: WHITE, priority: PRIORITY_THROWING },
    reflector: { type: "/" },
  },
  REFLECTOR_DOWN_RIGHT: {
    parentTemplate: "REFLECTOR_BASE",
    glyph: { glyph: "\\", color: WHITE, priority: PRIORITY_THROWING },
    reflector: { type: "\\" },
  },
  SPLITTER_BASE: {
    blocking: { throwing: false, moving: true },
    destructible: {},
    pickup: { effect: "PICKUP" },
  },
  SPLITTER_HORIZONTAL: {
    parentTemplate: "SPLITTER_BASE",
    glyph: {
      glyph: "⬌",
      color: WHITE,
      priority: PRIORITY_THROWING,
    },
    splitter: { type: "horizontal" },
  },
  SPLITTER_VERTICAL: {
    parentTemplate: "SPLITTER_BASE",
    glyph: {
      glyph: "⬍",
      color: WHITE,
      priority: PRIORITY_THROWING,
    },
    splitter: { type: "vertical" },
  },
};

export default templates;
