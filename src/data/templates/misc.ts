import {
  GREEN,
  PLAYER_ID,
  PRIORITY_PLAYER,
  PRIORITY_TERRAIN,
  WHITE,
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
    blocking: { moving: true, throwing: false },
    destructible: {},
    conductive: {},
  },
  FOV_MARKER: {
    display: {
      glyph: ".",
      tile: "floor",
      color: GREEN,
      priority: PRIORITY_TERRAIN,
    },
    fov: {},
  },
};

export default templates;
