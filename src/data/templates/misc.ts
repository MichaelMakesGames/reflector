import {
  PLAYER_ID,
  PRIORITY_PLAYER,
  PRIORITY_TERRAIN,
  PROJECTOR_RANGE,
  PRIORITY_ITEM,
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
      condition: null,
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
  REMOVING_MARKER: {
    display: {
      glyph: ".",
      tile: "outline_solid",
      color: colors.invalid,
      priority: PRIORITY_TERRAIN,
    },
    removingMarker: {},
  },
  DISABLE_MARKER: {
    display: {
      glyph: ".",
      tile: "outline_solid",
      color: colors.invalid,
      priority: PRIORITY_TERRAIN,
    },
    disableMarker: {},
  },
  JOB_DISABLER: {
    display: {
      glyph: "X",
      tile: "disabled",
      color: colors.invalid,
      priority: PRIORITY_ITEM,
    },
    jobDisabler: {},
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
    colonist: {
      residence: null,
      employment: null,
    },
  },
};

export default templates;
