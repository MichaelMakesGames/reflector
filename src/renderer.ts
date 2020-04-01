import { Required } from "Object/_api";
import * as PIXI from "pixi.js";
import colors from "~colors";
// @ts-ignore
import tiles from "./assets/tiles/*.png"; // eslint-disable-line import/no-unresolved
import {
  FONT_FAMILY,
  MAP_HEIGHT,
  MAP_WIDTH,
  TILE_SIZE,
  PLAYER_ID,
} from "./constants";
import { Display, Entity, Pos } from "./types";
import { arePositionsEqual } from "./utils/geometry";

const loadPromise = new Promise(resolve => {
  PIXI.Loader.shared
    .add(
      Object.entries(tiles as Record<string, string>).map(([name, file]) => ({
        name,
        url: file.startsWith("/") ? `.${file}` : file,
      })),
    )
    .load(resolve);
});

PIXI.autoDetectRenderer().destroy();

export const app = new PIXI.Application({
  width: MAP_WIDTH * TILE_SIZE,
  height: MAP_HEIGHT * TILE_SIZE,
  backgroundColor: parseInt(colors.background.substr(1), 16),
  antialias: false,
  // roundPixels: true,
});

let zoomedIn = false;
export function toggleZoom(pos: Pos) {
  if (zoomedIn) {
    zoomOut();
  } else {
    zoomTo(pos);
  }
}

export function zoomOut() {
  zoomedIn = false;
  app.stage.scale = new PIXI.Point(1, 1);
  app.stage.position = new PIXI.Point(0, 0);
}

export function zoomTo(pos: Pos) {
  const X_MIN = 0;
  const Y_MIN = 0;
  const X_MAX = MAP_WIDTH / 2;
  const Y_MAX = MAP_WIDTH / 2;
  const x = Math.max(Math.min(pos.x - MAP_WIDTH / 4, X_MAX), X_MIN);
  const y = Math.max(Math.min(pos.y - MAP_WIDTH / 4, Y_MAX), Y_MIN);
  zoomedIn = true;
  app.stage.scale = new PIXI.Point(2, 2);
  app.stage.position = new PIXI.Point(-x * TILE_SIZE * 2, -y * TILE_SIZE * 2);
}

PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

const renderEntities: {
  [id: string]: {
    displayComp: Display;
    pos: Pos;
    text: PIXI.Text;
    sprite?: PIXI.Sprite;
    background?: PIXI.Graphics;
  };
} = {};

const layers: {
  [priority: number]: PIXI.Container;
} = {};
function getLayer(priority: number) {
  if (layers[priority]) {
    return layers[priority];
  }
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

export async function addRenderEntity(
  entity: Required<Entity, "display" | "pos">,
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

  if (display.hasBackground) {
    const background = new PIXI.Graphics();
    background.beginFill(parseInt(colors.background.substr(1), 16));
    background.lineStyle(0);
    background.drawRect(0, 0, TILE_SIZE, TILE_SIZE);
    background.endFill();
    background.position = new PIXI.Point(pos.x * TILE_SIZE, pos.y * TILE_SIZE);

    renderEntities[entity.id].background = background;
    getLayer(display.priority).addChild(background);
  }

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
  sprite.angle = display.rotation || 0;
  setSpritePosition(sprite, pos, display);
  sprite.width = TILE_SIZE;
  sprite.height = TILE_SIZE;
  sprite.tint = parseInt((display.color || "#FFFFFF").substr(1), 16);

  return sprite;
}

function setSpritePosition(sprite: PIXI.Sprite, pos: Pos, display: Display) {
  let { x, y } = pos;
  switch (display.rotation) {
    case 90:
      x += 1;
      break;
    case 180:
      x += 1;
      y += 1;
      break;
    case 270:
      y += 1;
      break;
    default:
      break;
  }
  sprite.position.set(x * TILE_SIZE, y * TILE_SIZE);
}

export async function removeRenderEntity(entityId: string) {
  await loadPromise;
  const renderEntity = renderEntities[entityId];
  if (renderEntity) {
    delete renderEntities[entityId];
    if (renderEntity.background) {
      getLayer(renderEntity.displayComp.priority).removeChild(
        renderEntity.background,
      );
    }
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

export function clearRenderer() {
  for (const id of Object.keys(renderEntities)) {
    removeRenderEntity(id);
  }
}

export async function updateRenderEntity(
  entity: Required<Entity, "display" | "pos">,
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
        setSpritePosition(
          renderEntity.sprite,
          renderEntity.pos,
          renderEntity.displayComp,
        );
      }
      if (renderEntity.background) {
        renderEntity.background.position.set(
          entity.pos.x * TILE_SIZE,
          entity.pos.y * TILE_SIZE,
        );
      }
      if (entity.id === PLAYER_ID && zoomedIn) {
        zoomTo(entity.pos);
      }
    }

    if (
      renderEntity.displayComp.tile !== entity.display.tile ||
      renderEntity.displayComp.glyph !== entity.display.glyph ||
      renderEntity.displayComp.color !== entity.display.color ||
      renderEntity.displayComp.priority !== entity.display.priority ||
      renderEntity.displayComp.rotation !== entity.display.rotation ||
      renderEntity.displayComp.hasBackground !== entity.display.hasBackground
    ) {
      await removeRenderEntity(entity.id);
      await addRenderEntity(entity);
    }
  }
}
