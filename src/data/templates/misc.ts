import {
  PLAYER_ID,
  PRIORITY_PLAYER,
  PRIORITY_TERRAIN,
  PROJECTOR_RANGE,
} from "~/constants";
import { Entity } from "~/types/Entity";
import colors from "~colors";

const templates: { [id: string]: Partial<Entity> } = {
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
      color: colors.secondary,
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
};

export default templates;
