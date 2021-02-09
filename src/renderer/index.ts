import * as PIXI from "pixi.js";
import colors from "~colors";
// @ts-ignore
import tiles from "../assets/tiles/*.png"; // eslint-disable-line import/no-unresolved
import { MAP_HEIGHT, MAP_WIDTH, TILE_SIZE } from "../constants";
import Renderer from "./Renderer";

PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

const renderer = new Renderer({
  gridWidth: MAP_WIDTH,
  gridHeight: MAP_HEIGHT,
  tileWidth: TILE_SIZE,
  tileHeight: TILE_SIZE,
  backgroundColor: colors.background,
});

renderer.load(tiles);
renderer.start();

export default renderer;
