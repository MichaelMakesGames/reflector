export const PLAYER_ID = "PLAYER";

export const THROWING_RANGE = 5;
export const ANGLER_RANGE = 3;
export const BOMBER_RANGE = 5;
export const BOMBER_COOLDOWN = 2;

export const PRIORITY_LASER = 20;
export const PRIORITY_THROWING = 17;
export const PRIORITY_PLAYER = 15;
export const PRIORITY_ENEMY = 10;
export const PRIORITY_ITEM = 5;
export const PRIORITY_TERRAIN = 0;

export const ROOMS = 5;
export const ROOM_SIZE = 3;
export const MAZE_SIZE = ROOMS * 2 + 1;
export const MAP_WIDTH = ROOMS * ROOM_SIZE + ROOMS + 1;
export const MAP_HEIGHT = MAP_WIDTH;

export const BACKGROUND_COLOR = "#111";
export const FONT_SIZE = 22;
export const FONT_FAMILY = "Nova Mono";

export const WHITE = "#EEE";
export const RED = "#F88";
export const GREEN = "#8F8";
export const BLUE = "#88F";
export const GRAY = "#888";
export const YELLOW = "#FF8";
export const PURPLE = "#F8F";
export const BLACK = BACKGROUND_COLOR;
export const BRIGHT_RED = "#F00";
export const TRANSPARENT = "transparent";

export const RIGHT = { dx: 1, dy: 0 };
export const DOWN = { dx: 0, dy: 1 };
export const LEFT = { dx: -1, dy: 0 };
export const UP = { dx: 0, dy: -1 };
