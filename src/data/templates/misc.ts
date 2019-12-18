import {
  PLAYER_ID,
  PRIORITY_PLAYER,
  PRIORITY_TERRAIN,
  PROJECTOR_RANGE,
} from "~/constants";
import colors from "~colors";
import { Entity } from "~types";

const templates: Partial<Record<TemplateName, Partial<Entity>>> = {
  PLAYER: {
    id: PLAYER_ID,
    pos: { x: 1, y: 1 },
    display: {
      tile: "player",
      glyph: "@",
      color: colors.payer,
      priority: PRIORITY_PLAYER,
    },
    blocking: { moving: true, lasers: true },
    destructible: {
      onDestroy: "player",
    },
    conductive: {},
    projector: {
      range: PROJECTOR_RANGE,
    },
    description: {
      name: "Player",
      description: "This is you.",
    },
  },
  PLAYER_CORPSE: {
    display: {
      tile: "skull",
      glyph: "%",
      color: colors.payer,
      priority: PRIORITY_PLAYER,
    },
    blocking: { moving: true, lasers: true },
  },
  VALID_MARKER: {
    display: {
      glyph: ".",
      tile: "outline_dashed",
      color: colors.secondary,
      priority: PRIORITY_TERRAIN,
    },
    validMarker: {},
  },
  PLACING_MARKER: {
    display: {
      glyph: ".",
      tile: "outline_solid",
      color: colors.invalid,
      priority: PRIORITY_TERRAIN,
    },
    placingMarker: {},
  },
  INSPECTOR: {
    display: {
      glyph: "?",
      tile: "outline_solid",
      color: colors.secondary,
      priority: PRIORITY_TERRAIN,
    },
    inspector: {},
  },
  COLONIST: {
    display: {
      glyph: "c",
      tile: "colonists1",
      color: colors.payer,
      priority: PRIORITY_PLAYER,
    },
    destructible: {
      onDestroy: "colonist",
    },
    colonist: {},
  },
};

export default templates;
