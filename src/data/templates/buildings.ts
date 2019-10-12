import {
  PRIORITY_ITEM,
  PRIORITY_PLACING,
  WHITE,
  PROJECTOR_RANGE,
  GRAY,
} from "~/constants";
import { Entity } from "~/types/Entity";
import { reduceMorale, addEntity } from "~state/actions";
import { createEntityFromTemplate } from "~utils/entities";

function onDestroyHouse(entity: Entity) {
  if (entity.housing) {
    return reduceMorale({ amount: entity.housing.occupancy });
  }
  return null;
}

function onDestroyWall(entity: Entity) {
  return addEntity({
    entity: createEntityFromTemplate("WALL_DAMAGED", { pos: entity.pos }),
  });
}

const templates: { [id: string]: Partial<Entity> } = {
  REFLECTOR_BASE: {},
  REFLECTOR_UP_RIGHT: {
    parentTemplate: "REFLECTOR_BASE",
    display: {
      tile: "reflector_1",
      glyph: "/",
      color: WHITE,
      priority: PRIORITY_PLACING,
    },
    reflector: { type: "/" },
  },
  REFLECTOR_DOWN_RIGHT: {
    parentTemplate: "REFLECTOR_BASE",
    display: {
      tile: "reflector_2",
      glyph: "\\",
      color: WHITE,
      priority: PRIORITY_PLACING,
    },
    reflector: { type: "\\" },
  },
  SPLITTER_BASE: {
    blocking: { moving: true, lasers: true },
    destructible: {},
  },
  SPLITTER_HORIZONTAL: {
    parentTemplate: "SPLITTER_BASE",
    display: {
      tile: "splitter_1",
      glyph: "⬌",
      color: WHITE,
      priority: PRIORITY_PLACING,
    },
    splitter: { type: "horizontal" },
  },
  SPLITTER_VERTICAL: {
    parentTemplate: "SPLITTER_BASE",
    display: {
      tile: "splitter_2",
      glyph: "⬍",
      color: WHITE,
      priority: PRIORITY_PLACING,
    },
    splitter: { type: "vertical" },
  },
  TENT: {
    display: {
      tile: "tent",
      glyph: "▲",
      color: WHITE,
      priority: PRIORITY_ITEM,
    },
    blocking: {
      moving: true,
      lasers: true,
    },
    housing: {
      capacity: 1,
      occupancy: 1,
      desirability: -1,
      removeOnVacancy: true,
    },
    destructible: {
      onDestroy: onDestroyHouse,
    },
  },
  RESIDENCE: {
    display: {
      tile: "residence",
      glyph: "R",
      color: WHITE,
      priority: PRIORITY_ITEM,
    },
    blocking: {
      moving: true,
      lasers: true,
    },
    housing: {
      occupancy: 0,
      capacity: 3,
      desirability: 0,
    },
    destructible: {
      onDestroy: onDestroyHouse,
    },
  },
  MINE: {
    display: {
      tile: "mine",
      glyph: "m",
      color: WHITE,
      priority: PRIORITY_ITEM,
    },
    blocking: {
      moving: true,
      lasers: true,
    },
    destructible: {},
    production: {
      resource: "METAL",
      amount: 1,
    },
  },
  WALL: {
    display: {
      tile: "wall",
      glyph: "#",
      color: GRAY,
      priority: PRIORITY_ITEM,
    },
    blocking: {
      moving: true,
      lasers: true,
    },
    destructible: {
      onDestroy: onDestroyWall,
    },
  },
  WALL_DAMAGED: {
    display: {
      tile: "wall_damaged",
      glyph: "#",
      color: GRAY,
      priority: PRIORITY_ITEM,
    },
    blocking: {
      moving: true,
      lasers: true,
    },
    destructible: {},
  },
  PROJECTOR: {
    display: {
      tile: "projector",
      glyph: "p",
      color: WHITE,
      priority: PRIORITY_ITEM,
    },
    blocking: {
      moving: true,
      lasers: true,
    },
    destructible: {},
    projector: {
      range: PROJECTOR_RANGE,
    },
  },
};

export default templates;
