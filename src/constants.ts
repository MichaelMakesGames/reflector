export const VERSION = "alpha-3.0.0-unstable";
export const PLAYER_ID = "PLAYER";
export const CURSOR_ID = "UI_CURSOR";

export const BUILDING_RANGE = 2;
export const PROJECTOR_RANGE = 2;
export const STARTING_MORALE = 10;
export const VICTORY_POPULATION = 30;
export const NEW_COLONISTS_PER_DAY = 3;
export const BASE_LASER_STRENGTH = 100;

export const WAVE_SIZE_CONSTANT = 2;
export const WAVE_SIZE_POPULATION_MULTIPLIER = 1;
export const WAVE_SIZE_DAY_MULTIPLIER = 3;

export const MAP_WIDTH = 32;
export const MAP_HEIGHT = MAP_WIDTH;
export const TILE_SIZE = 24;
export const SIDE_BAR_CSS_WIDTH = "256px";
export const HEADER_CSS_HEIGHT = "33px";
export const BUILD_MENU_CSS_HEIGHT = "34px";
export const MAP_CSS_WIDTH = `min(calc(100vw - ${SIDE_BAR_CSS_WIDTH} - ${SIDE_BAR_CSS_WIDTH}), calc(100vh - ${BUILD_MENU_CSS_HEIGHT} - ${HEADER_CSS_HEIGHT}), ${
  TILE_SIZE * MAP_WIDTH
}px)`;
export const HEADER_CSS_WIDTH = `calc(${MAP_CSS_WIDTH} + ${SIDE_BAR_CSS_WIDTH} + ${SIDE_BAR_CSS_WIDTH})`;

export const MINUTES_PER_TURN = 15;
export const TURNS_PER_DAY = (24 * 60) / MINUTES_PER_TURN;
export const TURNS_PER_NIGHT = TURNS_PER_DAY / 2;
export const END_OF_NIGHT_ENEMY_SPAWNING_BUFFER =
  Math.max(MAP_HEIGHT, MAP_WIDTH) / 2;
export const BASE_IMMIGRATION_RATE = TURNS_PER_DAY;
export const DAY_START_MINUTES = 6 * 60; // 6:00am
export const VICTORY_ON_TURN = TURNS_PER_DAY * 10;

export const FOOD_PER_COLONIST = 1;
export const FARM_PRODUCTION = 5;
export const FARM_WORK = TURNS_PER_DAY / 2;
export const MINE_WORK = 4;
export const FACTORY_WORK = 8;
export const REACTOR_PRODUCTION = 10;

export const PRIORITY_MARKER = 35;
export const PRIORITY_LASER = 30;
export const PRIORITY_BUILDING_HIGH_DETAIL = 25;
export const PRIORITY_BUILDING_HIGH = 20;
export const PRIORITY_UNIT = 15;
export const PRIORITY_BUILDING_LOW_DETAIL = 10;
export const PRIORITY_BUILDING_LOW = 5;
export const PRIORITY_TERRAIN = 0;

export const FONT_FAMILY = "Nova Mono";

export const TRANSPARENT = "transparent";

export const RIGHT = { dx: 1, dy: 0 };
export const DOWN = { dx: 0, dy: 1 };
export const LEFT = { dx: -1, dy: 0 };
export const UP = { dx: 0, dy: -1 };

export const DEMO_PAUSE_MICRO = 10;
export const DEMO_PAUSE_SHORT = 500;
export const DEMO_PAUSE_LONG = 1000;
