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
import { addEntity } from "~state/actions";
import { createEntityFromTemplate } from "~utils/entities";

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
    destructible: {
      onDestroy: (entity: Entity) =>
        addEntity({
          entity: createEntityFromTemplate("PLAYER_CORPSE", {
            pos: entity.pos,
          }),
        }),
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
      color: WHITE,
      priority: PRIORITY_PLAYER,
    },
    blocking: { moving: true, lasers: true },
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
  INSPECTOR: {
    display: {
      glyph: "?",
      tile: "valid",
      color: YELLOW,
      priority: PRIORITY_TERRAIN,
    },
    inspector: {},
  },
};

export default templates;
