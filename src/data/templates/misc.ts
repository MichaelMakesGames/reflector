import {
  PLAYER_ID,
  PRIORITY_PLAYER,
  PRIORITY_TERRAIN,
  WHITE,
  PROJECTOR_RANGE,
  DARK_GREEN,
  YELLOW,
} from "~/constants";
import { Entity } from "~/types/Entity";

const templates: { [id: string]: Partial<Entity> } = {
  PLAYER: {
    id: PLAYER_ID,
    pos: { x: 1, y: 1 },
    display: {
      tile: "player",
      glyph: "@",
      color: WHITE,
      priority: PRIORITY_PLAYER,
    },
    blocking: { moving: true, lasers: true },
    destructible: {},
    conductive: {},
    projector: {
      range: PROJECTOR_RANGE,
    },
  },
  VALID_MARKER: {
    display: {
      glyph: ".",
      tile: "valid",
      color: YELLOW,
      priority: PRIORITY_TERRAIN,
    },
    validMarker: {},
  },
};

export default templates;
