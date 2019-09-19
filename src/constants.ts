export const PLAYER_ID = "PLAYER";

export const THROWING_RANGE = 5;

export const PRIORITY_LASER = 20;
export const PRIORITY_THROWING = 17;
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

export const BACKGROUND_COLOR = "#111111";
export const TILE_SIZE = 32;
export const FONT_FAMILY = "Nova Mono";

export const WHITE = "#EEEEEE";
export const RED = "#FF8888";
export const GREEN = "#88FF88";
export const BLUE = "#8888FF";
export const GRAY = "#888888";
export const DARK_GRAY = "#444444";
export const YELLOW = "#FFFF88";
export const PURPLE = "#FF88FF";
export const BLACK = BACKGROUND_COLOR;
export const BRIGHT_RED = "#FF4400";
export const TRANSPARENT = "transparent";

export const RIGHT = { dx: 1, dy: 0 };
export const DOWN = { dx: 0, dy: 1 };
export const LEFT = { dx: -1, dy: 0 };
export const UP = { dx: 0, dy: -1 };
