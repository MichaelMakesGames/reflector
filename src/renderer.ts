import * as PIXI from "pixi.js";
import {
  MAP_WIDTH,
  MAP_HEIGHT,
  TILE_SIZE,
  BACKGROUND_COLOR,
  FONT_FAMILY,
} from "./constants";
import { Entity, MakeRequired, Display, Pos } from "./types";
import { arePositionsEqual } from "./utils";

// @ts-ignore
import tiles from "./assets/tiles/*.png";

const loadPromise = new Promise(resolve => {
  PIXI.loader
    .add(
      Object.entries(tiles).map(([name, file]) => ({
        name,
        url: `.${file}`,
      })),
    )
    .load(resolve);
});

PIXI.autoDetectRenderer().destroy();

export const app = new PIXI.Application({
  width: MAP_WIDTH * TILE_SIZE,
  height: MAP_HEIGHT * TILE_SIZE,
  backgroundColor: parseInt(BACKGROUND_COLOR.substr(1), 16),
  antialias: false,
  roundPixels: true,
});

PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

const renderEntities: {
  [id: string]: {
    displayComp: Display;
    pos: Pos;
    text: PIXI.Text;
    sprite?: PIXI.Sprite;
  };
} = {};

const layers: {
  [priority: number]: PIXI.Container;
} = {};
function getLayer(priority: number) {
  if (layers[priority]) {
    return layers[priority];
  } else {
    const layer = new PIXI.Container();
    layer.name = priority.toString();
    layers[priority] = layer;
    app.stage.addChild(layer);
    app.stage.children.sort((a, b) => {
      const aPriority = parseFloat(a.name || "0") || 0;
      const bPriority = parseFloat(b.name || "0") || 0;
      return aPriority - bPriority;
    });
    return layer;
  }
}

export async function addRenderEntity(
  entity: MakeRequired<Entity, "display" | "pos">,
) {
  await loadPromise;
  const { pos, display } = entity;
  const text = new PIXI.Text(display.glyph, {
    fontFamily: FONT_FAMILY,
    fontSize: TILE_SIZE,
    fill: display.color,
  });
  text.position.set(pos.x * TILE_SIZE, pos.y * TILE_SIZE);
  renderEntities[entity.id] = {
    displayComp: { ...display },
    pos: { ...pos },
    text,
  };
  if (display.tile) {
    const sprite = createSprite(pos, display);
    renderEntities[entity.id].sprite = sprite;
    getLayer(display.priority).addChild(sprite);
  } else {
    getLayer(display.priority).addChild(text);
  }
}

function createSprite(pos: Pos, display: Display) {
  const sprite = new PIXI.Sprite(
    PIXI.utils.TextureCache[display.tile || "unknown"],
  );
  sprite.position.set(pos.x * TILE_SIZE, pos.y * TILE_SIZE);
  sprite.width = TILE_SIZE;
  sprite.height = TILE_SIZE;
  sprite.tint = parseInt((display.color || "#FFFFFF").substr(1), 16);
  return sprite;
}

export async function removeRenderEntity(entityId: string) {
  await loadPromise;
  const renderEntity = renderEntities[entityId];
  if (renderEntity) {
    delete renderEntities[entityId];
    if (renderEntity.sprite) {
      getLayer(renderEntity.displayComp.priority).removeChild(
        renderEntity.sprite,
      );
    } else {
      getLayer(renderEntity.displayComp.priority).removeChild(
        renderEntity.text,
      );
    }
  }
}

export async function updateRenderEntity(
  entity: MakeRequired<Entity, "display" | "pos">,
) {
  await loadPromise;
  const renderEntity = renderEntities[entity.id];
  if (renderEntity) {
    if (!arePositionsEqual(renderEntity.pos, entity.pos)) {
      renderEntity.pos = entity.pos;
      renderEntity.text.position.set(
        entity.pos.x * TILE_SIZE,
        entity.pos.y * TILE_SIZE,
      );
      if (renderEntity.sprite) {
        renderEntity.sprite.position.set(
          entity.pos.x * TILE_SIZE,
          entity.pos.y * TILE_SIZE,
        );
      }
    }

    if (
      renderEntity.displayComp.tile !== entity.display.tile ||
      renderEntity.displayComp.glyph !== entity.display.glyph ||
      renderEntity.displayComp.color !== entity.display.color ||
      renderEntity.displayComp.priority !== entity.display.priority
    ) {
      await removeRenderEntity(entity.id);
      await addRenderEntity(entity);
    }

    // if (sprite.displayComp.tile !== entity.display.tile) {
    //   sprite.displayComp.tile = entity.display.tile;
    //   if (sprite.sprite) {
    //     getLayer(sprite.displayComp.priority).removeChild(sprite.sprite);
    //     delete sprite.sprite;
    //   } else {
    //     getLayer(sprite.displayComp.priority).removeChild(sprite.text);
    //   }

    //   if (sprite.displayComp.tile) {
    //     const newSprite = createSprite(sprite.pos, sprite.displayComp);
    //     getLayer(sprite.displayComp.priority).addChild(newSprite);
    //     sprite.sprite = newSprite;
    //   } else {
    //     getLayer(sprite.displayComp.priority).addChild(sprite.text);
    //   }
    // }

    // if (sprite.displayComp.glyph !== entity.display.glyph) {
    //   sprite.displayComp.glyph = entity.display.glyph;
    //   sprite.text.text = sprite.displayComp.glyph;
    // }

    // if (sprite.displayComp.color !== entity.display.color) {
    //   sprite.displayComp.color = entity.display.color;
    //   sprite.text.style.fill = sprite.displayComp.color;
    //   if (sprite.sprite) {
    //     sprite.sprite.tint = parseInt(
    //       (entity.display.color || "#FFFFFF").substr(1),
    //       16,
    //     );
    //   }
    // }
  }
}
