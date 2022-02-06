import * as PIXI from "pixi.js";
// @ts-ignore
import tiles from "url:../assets/tiles/*.png"; // eslint-disable-line import/no-unresolved
import colors from "../colors";
import { MAP_HEIGHT, MAP_WIDTH, TILE_SIZE } from "../constants";
import Renderer from "./Renderer";

PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

const renderer = new Renderer({
  gridWidth: MAP_WIDTH,
  gridHeight: MAP_HEIGHT,
  tileWidth: TILE_SIZE,
  tileHeight: TILE_SIZE,
  appWidth: MAP_WIDTH * TILE_SIZE,
  appHeight: MAP_HEIGHT * TILE_SIZE,
  backgroundColor: colors.background,
  autoCenterEnabled: true,
});

renderer.load(tiles);
renderer.start();

export default renderer;
