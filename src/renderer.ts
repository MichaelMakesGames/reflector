/* global requestAnimationFrame, document */
import { Required } from "Object/_api";
import * as PIXI from "pixi.js";
import * as particles from "pixi-particles";
import colors from "~colors";
// @ts-ignore
import tiles from "./assets/tiles/*.png"; // eslint-disable-line import/no-unresolved
import { MAP_HEIGHT, MAP_WIDTH, PLAYER_ID, TILE_SIZE } from "./constants";
import { Display, Entity, Pos } from "./types";
import { arePositionsEqual } from "./utils/geometry";

export const loadPromise = new Promise((resolve) => {
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

PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

const renderEntities: {
  [id: string]: {
    displayComp: Display;
    pos: Pos;
    sprite?: PIXI.Sprite;
    background?: PIXI.Graphics;
    isVisible?: boolean;
  };
} = {};

export const app = new PIXI.Application({
  width: MAP_WIDTH * TILE_SIZE,
  height: MAP_HEIGHT * TILE_SIZE,
  backgroundColor: parseInt(colors.background.substr(1), 16),
  antialias: false,
  // roundPixels: true,
});

const emitters: Record<string, particles.Emitter> = {};
export function addSmoke(pos: Pos, offset: Pos) {
  loadPromise.then(() => {
    const key = `${pos.x},${pos.y},${offset.x},${offset.y}`;
    if (emitters[key]) {
      emitters[key].spawnChance = 1;
      return;
    }
    const texture = PIXI.Texture.WHITE;
    const emitter = new particles.Emitter(app.stage, [texture], {
      alpha: {
        start: 0.5,
        end: 0.0,
      },
      scale: {
        start: 1 / 8,
        end: 3 / 4,
        minimumScaleMultiplier: 1,
      },
      color: {
        start: colors.ground,
        end: colors.ground,
      },
      speed: {
        start: 5,
        end: 3,
        minimumSpeedMultiplier: 1,
      },
      acceleration: {
        x: 1,
        y: 0,
      },
      maxSpeed: 0,
      startRotation: {
        min: 270,
        max: 300,
      },
      noRotation: true,
      rotationSpeed: {
        min: 0,
        max: 0,
      },
      lifetime: {
        min: 3,
        max: 6,
      },
      blendMode: "normal",
      frequency: 0.25,
      emitterLifetime: -1,
      maxParticles: 1000,
      particlesPerWave: 3,
      pos: {
        x: pos.x * TILE_SIZE + offset.x,
        y: pos.y * TILE_SIZE + offset.y,
      },
      addAtBack: false,
      spawnType: "point",
    });
    emitters[key] = emitter;
  });
}

export function stopSmoke(pos: Pos, offset: Pos) {
  const key = `${pos.x},${pos.y},${offset.x},${offset.y}`;
  const emitter = emitters[key];
  if (emitter) {
    emitter.spawnChance = 0;
  }
}

export function removeSmoke(pos: Pos, offset: Pos) {
  const key = `${pos.x},${pos.y},${offset.x},${offset.y}`;
  const emitter = emitters[key];
  if (emitter) {
    emitter.destroy();
  }
  delete emitters[key];
}

export function flash(pos: Pos, color: string) {
  loadPromise.then(() => {
    const texture = PIXI.Texture.WHITE;
    new particles.Emitter(app.stage, [texture], {
      alpha: {
        start: 1,
        end: 0,
      },
      scale: {
        start: 1 / 8,
        end: 4,
        minimumScaleMultiplier: 1,
      },
      color: {
        start: color,
        end: color,
      },
      speed: {
        start: 5,
        end: 3,
        minimumSpeedMultiplier: 1,
      },
      acceleration: {
        x: 0,
        y: 0,
      },
      maxSpeed: 0,
      startRotation: {
        min: 0,
        max: 0,
      },
      noRotation: true,
      rotationSpeed: {
        min: 0,
        max: 0,
      },
      lifetime: {
        min: 0.5,
        max: 0.5,
      },
      blendMode: "normal",
      frequency: 0.1,
      emitterLifetime: 0.2,
      maxParticles: 1000,
      particlesPerWave: 1,
      pos: {
        x: pos.x * TILE_SIZE + TILE_SIZE / 2,
        y: pos.y * TILE_SIZE + TILE_SIZE / 2,
      },
      addAtBack: false,
      spawnType: "point",
    }).playOnceAndDestroy();
  });
}

loadPromise.then(() => {
  let lastTime = Date.now();
  const update = () => {
    requestAnimationFrame(update);
    const now = Date.now();
    Object.values(emitters).forEach((emitter) => {
      emitter.update((now - lastTime) / 1000);
    });
    lastTime = now;
    // app.render();
  };
  update();
});

let zoomedIn = false;

export function isZoomedIn() {
  return zoomedIn;
}

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
  Object.values(renderEntities).forEach(updateVisibility);
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
  Object.values(renderEntities).forEach(updateVisibility);
}

export function getPosFromMouse(mouseX: number, mouseY: number): Pos {
  const canvas = document.getElementById("map") as HTMLCanvasElement;
  const scaleX = (MAP_WIDTH * TILE_SIZE) / canvas.clientWidth;
  const scaleY = (MAP_HEIGHT * TILE_SIZE) / canvas.clientHeight;
  const scaledMouseX = mouseX * scaleX;
  const scaledMouseY = mouseY * scaleY;
  if (!zoomedIn) {
    return {
      x: Math.floor(scaledMouseX / TILE_SIZE),
      y: Math.floor(scaledMouseY / TILE_SIZE),
    };
  } else {
    const offsetX = Math.floor(scaledMouseX / TILE_SIZE / 2);
    const offsetY = Math.floor(scaledMouseY / TILE_SIZE / 2);
    const stageX = app.stage.position.x / TILE_SIZE / -2;
    const stageY = app.stage.position.y / TILE_SIZE / -2;
    return {
      x: stageX + offsetX,
      y: stageY + offsetY,
    };
  }
}

export function getClientRectFromPos(gamePos: Pos): ClientRect {
  const canvas = document.getElementById("map") as HTMLCanvasElement;
  const scaleX = (MAP_WIDTH * TILE_SIZE) / canvas.clientWidth;
  const scaleY = (MAP_HEIGHT * TILE_SIZE) / canvas.clientHeight;
  if (!zoomedIn) {
    const width = TILE_SIZE / scaleX;
    const height = TILE_SIZE / scaleY;
    const left =
      canvas.getBoundingClientRect().left + (gamePos.x * TILE_SIZE) / scaleX;
    const right = left + width;
    const top =
      canvas.getBoundingClientRect().top + (gamePos.y * TILE_SIZE) / scaleY;
    const bottom = top + height;
    return { width, height, left, right, top, bottom };
  } else {
    const stageX = app.stage.position.x / TILE_SIZE / -2;
    const stageY = app.stage.position.y / TILE_SIZE / -2;
    const width = (TILE_SIZE * 2) / scaleX;
    const height = (TILE_SIZE * 2) / scaleY;
    const left =
      canvas.getBoundingClientRect().left +
      ((gamePos.x - stageX) * TILE_SIZE * 2) / scaleX;
    const right = left + width;
    const top =
      canvas.getBoundingClientRect().top +
      ((gamePos.y - stageY) * TILE_SIZE * 2) / scaleY;
    const bottom = top + height;
    return { width, height, left, right, top, bottom };
  }
}

function isPosVisible(pos: Pos) {
  if (zoomedIn) {
    const xMin = app.stage.position.x / (TILE_SIZE * -2);
    const yMin = app.stage.position.y / (TILE_SIZE * -2);
    const xMax = xMin + MAP_WIDTH / 2;
    const yMax = yMin + MAP_HEIGHT / 2;
    return pos.x >= xMin && pos.x < xMax && pos.y >= yMin && pos.y < yMax;
  } else {
    return pos.x >= 0 && pos.x < MAP_WIDTH && pos.y >= 0 && pos.y < MAP_HEIGHT;
  }
}

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

export function addRenderEntity(entity: Required<Entity, "display" | "pos">) {
  const { pos, display } = entity;
  renderEntities[entity.id] = {
    displayComp: { ...display },
    pos: { ...pos },
  };

  if (display.hasBackground) {
    const background = new PIXI.Graphics();
    background.beginFill(app.renderer.backgroundColor);
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
  }

  updateVisibility(renderEntities[entity.id]);
}

function createSprite(pos: Pos, display: Display) {
  let sprite: PIXI.Sprite | PIXI.AnimatedSprite;
  if (typeof display.tile === "string") {
    sprite = new PIXI.Sprite(
      PIXI.utils.TextureCache[display.tile || "unknown"],
    );
  } else {
    sprite = new PIXI.AnimatedSprite(
      display.tile.map((tile) => PIXI.utils.TextureCache[tile || "unknown"]),
    );
    (sprite as PIXI.AnimatedSprite).animationSpeed = display.speed || 0.2;
    (sprite as PIXI.AnimatedSprite).play();
  }
  sprite.angle = display.rotation || 0;
  setSpritePosition(sprite, pos, display);
  sprite.width = TILE_SIZE;
  sprite.height = TILE_SIZE;
  sprite.tint = parseInt((display.color || "#FFFFFF").substr(1), 16);

  return sprite;
}

export function playAnimation(entityId: string) {
  const renderEntity = renderEntities[entityId];
  if (
    renderEntity &&
    renderEntity.sprite &&
    renderEntity.sprite instanceof PIXI.AnimatedSprite
  ) {
    renderEntity.sprite.play();
  }
}

export function stopAnimation(entityId: string) {
  const renderEntity = renderEntities[entityId];
  if (
    renderEntity &&
    renderEntity.sprite &&
    renderEntity.sprite instanceof PIXI.AnimatedSprite
  ) {
    renderEntity.sprite.stop();
  }
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

export function removeRenderEntity(entityId: string) {
  const renderEntity = renderEntities[entityId];
  if (renderEntity) {
    delete renderEntities[entityId];
    if (renderEntity.background) {
      renderEntity.background.parent.removeChild(renderEntity.background);
    }
    if (renderEntity.sprite) {
      renderEntity.sprite.parent.removeChild(renderEntity.sprite);
    }
  }
}

export function setBackgroundColor(color: string) {
  app.renderer.backgroundColor = parseInt(color.substr(1), 16);
  for (const [id, renderEntity] of Object.entries(renderEntities)) {
    reAddRenderEntity({
      id,
      display: renderEntity.displayComp,
      pos: renderEntity.pos,
      template: "" as TemplateName,
    });
  }
}

export function clearRenderer() {
  for (const id of Object.keys(renderEntities)) {
    removeRenderEntity(id);
  }
  for (const [key, emitter] of Object.entries(emitters)) {
    emitter.destroy();
    delete emitters[key];
  }
}

export function updateRenderEntity(
  entity: Required<Entity, "display" | "pos">,
) {
  const renderEntity = renderEntities[entity.id];
  if (renderEntity) {
    if (!arePositionsEqual(renderEntity.pos, entity.pos)) {
      renderEntity.pos = entity.pos;
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
      renderEntity.displayComp.color !== entity.display.color ||
      renderEntity.displayComp.priority !== entity.display.priority ||
      renderEntity.displayComp.rotation !== entity.display.rotation ||
      renderEntity.displayComp.hasBackground !== entity.display.hasBackground
    ) {
      reAddRenderEntity(entity);
    }

    updateVisibility(renderEntity);
  }
}

function updateVisibility(renderEntity: typeof renderEntities[string]) {
  const wasVisible = renderEntity.isVisible;
  const isVisible = isPosVisible(renderEntity.pos);
  // eslint-disable-next-line no-param-reassign
  renderEntity.isVisible = isVisible;
  if (isVisible && !wasVisible && renderEntity.displayComp.flashWhenVisible) {
    flash(renderEntity.pos, renderEntity.displayComp.color);
  }
}

export function reAddRenderEntity(entity: Required<Entity, "display" | "pos">) {
  const renderEntity = renderEntities[entity.id];
  const isPlaying =
    renderEntity && renderEntity.sprite instanceof PIXI.AnimatedSprite
      ? renderEntity.sprite.playing
      : false;
  removeRenderEntity(entity.id);
  addRenderEntity(entity);
  if (renderEntity && renderEntity.sprite instanceof PIXI.AnimatedSprite) {
    if (isPlaying) {
      playAnimation(entity.id);
    } else {
      stopAnimation(entity.id);
    }
  }
}
