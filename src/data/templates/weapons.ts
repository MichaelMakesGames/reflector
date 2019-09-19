import { RED, PRIORITY_ITEM } from "~/constants";
import { Entity } from "~/types/Entity";

const templates: { [id: string]: Partial<Entity> } = {
  WEAPON_BASE: {
    display: {
      tile: "item_gun",
      glyph: "w",
      color: RED,
      priority: PRIORITY_ITEM,
    },
  },
  WEAPON_LASER: {
    parentTemplate: "WEAPON_BASE",
    weapon: {
      name: "Laser",
      type: "LASER",
      power: 2,
      slot: 0,
      active: false,
    },
  },
  WEAPON_FAST_LASER: {
    parentTemplate: "WEAPON_BASE",
    weapon: {
      name: "Fast Laser",
      type: "LASER",
      power: 1,
      slot: 0,
      active: false,
    },
  },
  WEAPON_HEAVY_LASER: {
    parentTemplate: "WEAPON_BASE",
    weapon: {
      name: "Heavy Laser",
      type: "LASER",
      power: 3,
      slot: 0,
      active: false,
    },
  },
  WEAPON_TELEPORTER: {
    parentTemplate: "WEAPON_BASE",
    weapon: {
      name: "Teleporter",
      type: "TELEPORT",
      power: 1,
      slot: 0,
      active: false,
    },
  },
  WEAPON_LIGHTNING_GUN: {
    parentTemplate: "WEAPON_BASE",
    weapon: {
      name: "Lightning Gun",
      type: "ELECTRIC",
      power: 1,
      slot: 0,
      active: false,
    },
  },
  WEAPON_STORM_CANNON: {
    parentTemplate: "WEAPON_BASE",
    weapon: {
      name: "Storm Cannon",
      type: "ELECTRIC",
      power: 3,
      slot: 0,
      active: false,
    },
  },
  WEAPON_COMBUSTION_BEAM: {
    parentTemplate: "WEAPON_BASE",
    weapon: {
      name: "Combustion Beam",
      type: "EXPLOSIVE",
      power: 1,
      slot: 0,
      active: false,
    },
  },
  WEAPON_END_BRINGER: {
    parentTemplate: "WEAPON_BASE",
    weapon: {
      name: "End Bringer",
      type: "EXPLOSIVE",
      power: 3,
      slot: 0,
      active: false,
    },
  },
};

export default templates;
