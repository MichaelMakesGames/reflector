export const VERSION = "alpha-2.0.0";
export const PLAYER_ID = "PLAYER";
export const CURSOR_ID = "CURSOR";

export const BUILDING_RANGE = 2;
export const PROJECTOR_RANGE = 2;
export const STARTING_MORALE = 10;
export const VICTORY_POPULATION = 30;
export const COLONISTS_PER_IMMIGRATION_WAVE = 3;
export const NIGHT_SPAWN_START_BUFFER = 0;
export const NIGHT_SPAWN_END_BUFFER = 10;
export const ENEMIES_PER_TURN_POPULATION_MULTIPLIER = 0.1;
export const ENEMIES_PER_TURN_DAY_MULTIPLIER = 0.1;
export const STARTING_METAL = 25;
export const STARTING_FOOD = 5;
export const STARTING_POWER = 0;
export const BASE_LASER_STRENGTH = 100;
export const UNPOWERED_LASER_STRENGTH = 1;

export const MINUTES_PER_TURN = 30;
export const TURNS_PER_DAY = (24 * 60) / MINUTES_PER_TURN;
export const TURNS_PER_NIGHT = TURNS_PER_DAY / 2;
export const BASE_IMMIGRATION_RATE = TURNS_PER_DAY;
export const DAY_START_MINUTES = 8 * 60; // 8:00am
export const VICTORY_ON_TURN = TURNS_PER_DAY * 10;

export const PRIORITY_MARKER = 25;
export const PRIORITY_LASER = 20;
export const PRIORITY_BUILDING_HIGH = 15;
export const PRIORITY_UNIT = 10;
export const PRIORITY_BUILDING_LOW = 5;
export const PRIORITY_TERRAIN = 0;

export const MAP_WIDTH = 32;
export const MAP_HEIGHT = MAP_WIDTH;

export const TILE_SIZE = 24;
export const FONT_FAMILY = "Nova Mono";

export const TRANSPARENT = "transparent";

export const RIGHT = { dx: 1, dy: 0 };
export const DOWN = { dx: 0, dy: 1 };
export const LEFT = { dx: -1, dy: 0 };
export const UP = { dx: 0, dy: -1 };

export const UP_KEYS = ["w", "up", "k"];
export const RIGHT_KEYS = ["d", "right", "l"];
export const DOWN_KEYS = ["s", "down", "j"];
export const LEFT_KEYS = ["a", "left", "h"];
export const CANCEL_KEYS = ["q", "esc", "del", "backspace"];
export const CONFIRM_KEYS = ["space", "enter"];
