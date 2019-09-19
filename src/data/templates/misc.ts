import { Entity } from "~/types/Entity";
import {
  PRIORITY_ENEMY,
  GREEN,
  PRIORITY_TERRAIN,
  PLAYER_ID,
  WHITE,
  PRIORITY_PLAYER,
  BRIGHT_RED,
} from "~/constants";

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
