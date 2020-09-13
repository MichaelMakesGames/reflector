export const VERSION = "alpha-2.0.0-unstable";
export const PLAYER_ID = "PLAYER";
export const CURSOR_ID = "CURSOR";

export const BUILDING_RANGE = 2;
export const PROJECTOR_RANGE = 2;
export const STARTING_MORALE = 10;
export const VICTORY_POPULATION = 30;
export const COLONISTS_PER_IMMIGRATION_WAVE = 3;
export const ENEMIES_PER_TURN_POPULATION_MULTIPLIER = 0.1;
export const ENEMIES_PER_TURN_DAY_MULTIPLIER = 0.1;
export const BASE_LASER_STRENGTH = 100;
export const FOOD_PER_COLONIST = 10;

export const MAP_WIDTH = 32;
export const MAP_HEIGHT = MAP_WIDTH;

export const MINUTES_PER_TURN = 15;
export const TURNS_PER_DAY = (24 * 60) / MINUTES_PER_TURN;
export const TURNS_PER_NIGHT = TURNS_PER_DAY / 2;
export const END_OF_NIGHT_ENEMY_SPAWNING_BUFFER =
  Math.max(MAP_HEIGHT, MAP_WIDTH) / 2;
export const BASE_IMMIGRATION_RATE = TURNS_PER_DAY;
export const DAY_START_MINUTES = 8 * 60; // 8:00am
export const VICTORY_ON_TURN = TURNS_PER_DAY * 10;

export const PRIORITY_MARKER = 25;
export const PRIORITY_LASER = 20;
export const PRIORITY_BUILDING_HIGH = 15;
export const PRIORITY_UNIT = 10;
export const PRIORITY_BUILDING_LOW = 5;
export const PRIORITY_TERRAIN = 0;

export const TILE_SIZE = 24;
export const FONT_FAMILY = "Nova Mono";

export const TRANSPARENT = "transparent";

export const RIGHT = { dx: 1, dy: 0 };
export const DOWN = { dx: 0, dy: 1 };
export const LEFT = { dx: -1, dy: 0 };
export const UP = { dx: 0, dy: -1 };
