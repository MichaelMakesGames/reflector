export const VERSION = "1.0.0";
export const PLAYER_ID = "PLAYER";

export const BUILDING_RANGE = 2;
export const PROJECTOR_RANGE = 2;
export const BASE_IMMIGRATION_RATE = 5;
export const STARTING_MORALE = 10;
export const VICTORY_POPULATION = 50;
export const TURNS_BETWEEN_WAVES_BASE = 20;
export const WAVE_DURATION_BASE = 5;
export const ENEMIES_PER_WAVE_POPULATION_MULTIPLIER = 0.5;
export const STARTING_METAL = 0;

export const PRIORITY_LASER = 20;
export const PRIORITY_PLACING = 17;
export const PRIORITY_PLAYER = 15;
export const PRIORITY_ENEMY = 10;
export const PRIORITY_ITEM = 5;
export const PRIORITY_TERRAIN = 0;
export const PRIORITY_FLOOR = -5;

export const ROOMS = 5;
export const ROOM_SIZE = 3;
export const MAZE_SIZE = ROOMS * 2 + 1;
export const MAP_WIDTH = ROOMS * ROOM_SIZE + ROOMS + 1;
export const MAP_HEIGHT = MAP_WIDTH;

export const TILE_SIZE = 32;
export const FONT_FAMILY = "Nova Mono";

export const TRANSPARENT = "transparent";

export const RIGHT = { dx: 1, dy: 0 };
export const DOWN = { dx: 0, dy: 1 };
export const LEFT = { dx: -1, dy: 0 };
export const UP = { dx: 0, dy: -1 };
