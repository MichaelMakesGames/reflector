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
    hitPoints: { current: 3, max: 3 },
    inventory: { reflectors: 3, splitters: 1 },
    conductive: {},
  },
  BOMB: {
    display: {
      tile: "bomb",
      glyph: "b",
      color: BRIGHT_RED,
      priority: PRIORITY_ENEMY,
    },
    blocking: { throwing: false, moving: true },
    destructible: {},
    bomb: { time: 0 },
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
