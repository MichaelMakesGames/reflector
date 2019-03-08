import { Entity } from "../types";
import {
  BLUE,
  PRIORITY_ENEMY,
  GREEN,
  PRIORITY_TERRAIN,
  PLAYER_ID,
  WHITE,
  PRIORITY_PLAYER,
  BRIGHT_RED,
} from "../constants";

const templates: { [id: string]: Partial<Entity> } = {
  PLAYER: {
    id: PLAYER_ID,
    position: { x: 1, y: 1 },
    glyph: { glyph: "@", color: WHITE, priority: PRIORITY_PLAYER },
    blocking: { moving: true, throwing: false },
    hitPoints: { current: 3, max: 3 },
    inventory: { reflectors: 3, splitters: 1 },
    conductive: {},
  },
  BOMB: {
    glyph: { glyph: "b", color: BRIGHT_RED, priority: PRIORITY_ENEMY },
    blocking: { throwing: false, moving: true },
    destructible: {},
    bomb: { time: 1 },
  },
  LASER: {
    targeting: {},
  },
  FOV_MARKER: {
    glyph: { glyph: ".", color: GREEN, priority: PRIORITY_TERRAIN },
    fov: {},
  },
};

export default templates;
