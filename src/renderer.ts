import * as PIXI from "pixi.js";
import {
  MAP_WIDTH,
  MAP_HEIGHT,
  TILE_SIZE,
  BACKGROUND_COLOR,
  FONT_FAMILY,
} from "./constants";
import { Entity, MakeRequired, Glyph, Pos } from "./types";
import { arePositionsEqual } from "./utils";

PIXI.autoDetectRenderer().destroy();

export const app = new PIXI.Application({
  width: MAP_WIDTH * TILE_SIZE,
  height: MAP_HEIGHT * TILE_SIZE,
  backgroundColor: parseInt(BACKGROUND_COLOR.substr(1), 16),
  antialias: false,
  roundPixels: true,
});

const sprites: {
  [id: string]: {
    glyph: Glyph;
    pos: Pos;
    displayObject: PIXI.Text;
  };
} = {};

export function addSprite(entity: MakeRequired<Entity, "glyph" | "pos">) {
  const { pos, glyph } = entity;
  const displayObject = new PIXI.Text(glyph.glyph, {
    fontFamily: FONT_FAMILY,
    fontSize: TILE_SIZE,
    fill: glyph.color,
  });
  displayObject.position.set(pos.x * TILE_SIZE, pos.y * TILE_SIZE);
  sprites[entity.id] = { glyph: { ...glyph }, pos: { ...pos }, displayObject };
  app.stage.addChild(displayObject);
}

export function removeSprite(entityId: string) {
  const sprite = sprites[entityId];
  if (sprite) {
    delete sprites[entityId];
    app.stage.removeChild(sprite.displayObject);
  }
}

export function updateSprite(entity: MakeRequired<Entity, "glyph" | "pos">) {
  const sprite = sprites[entity.id];
  if (sprite) {
    if (!arePositionsEqual(sprite.pos, entity.pos)) {
      sprite.pos = entity.pos;
      sprite.displayObject.position.set(
        entity.pos.x * TILE_SIZE,
        entity.pos.y * TILE_SIZE,
      );
    }

    if (sprite.glyph.glyph !== entity.glyph.glyph) {
      sprite.glyph.glyph = entity.glyph.glyph;
      sprite.displayObject.text = sprite.glyph.glyph;
    }

    if (sprite.glyph.color !== entity.glyph.color) {
      sprite.glyph.color = entity.glyph.color;
      sprite.displayObject.style.fill = sprite.glyph.color;
    }
  }
}
