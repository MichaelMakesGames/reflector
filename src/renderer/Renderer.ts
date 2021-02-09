/* global requestAnimationFrame */
import { Required } from "Object/_api";
import * as particles from "pixi-particles";
import * as PIXI from "pixi.js";
import colors from "~colors";
import { PLAYER_ID } from "~constants";
import { Display, Entity, Pos } from "~types";
import { arePositionsEqual } from "~utils/geometry";

export interface RendererConfig {
  gridWidth: number;
  gridHeight: number;
  tileWidth: number;
  tileHeight: number;
  backgroundColor: string;
}

interface RenderEntity {
  displayComp: Display;
  pos: Pos;
  sprite?: PIXI.Sprite;
  background?: PIXI.Graphics;
  isVisible?: boolean;
}

export default class Renderer {
  private gridWidth: number;

  private gridHeight: number;

  private tileHeight: number;

  private tileWidth: number;

  private appWidth: number;

  private appHeight: number;

  private renderEntities: Record<string, RenderEntity> = {};

  private emitters: Record<string, particles.Emitter> = {};

  private loadPromise: null | Promise<unknown> = null;

  private app: PIXI.Application;

  private zoomedIn: boolean = false;

  private layers: Record<number, PIXI.Container> = {};

  public constructor({
    gridWidth,
    gridHeight,
    tileWidth,
    tileHeight,
    backgroundColor,
  }: RendererConfig) {
    this.gridWidth = gridWidth;
    this.gridHeight = gridHeight;
    this.tileWidth = tileWidth;
    this.tileHeight = tileHeight;
    this.appWidth = gridWidth * tileWidth;
    this.appHeight = gridHeight * tileHeight;
    this.app = new PIXI.Application({
      width: this.appWidth,
      height: this.appHeight,
      backgroundColor: hexToNumber(backgroundColor),
      antialias: false,
    });
  }

  public load(assets: Record<string, string>) {
    this.loadPromise = new Promise((resolve) =>
      PIXI.Loader.shared
        .add(
          Object.entries(assets).map(([name, file]) => ({
            name,
            url: file.startsWith("/") ? `.${file}` : file,
          })),
        )
        .load(resolve),
    );
    return this.loadPromise;
  }

  public zoomTo(pos: Pos): void {
    const X_MIN = 0;
    const Y_MIN = 0;
    const X_MAX = this.gridWidth / 2;
    const Y_MAX = this.gridHeight / 2;
    const x = Math.max(Math.min(pos.x - this.gridWidth / 4, X_MAX), X_MIN);
    const y = Math.max(Math.min(pos.y - this.gridHeight / 4, Y_MAX), Y_MIN);
    this.zoomedIn = true;
    this.app.stage.scale = new PIXI.Point(2, 2);
    this.app.stage.position = new PIXI.Point(
      -x * this.tileWidth * 2,
      -y * this.tileHeight * 2,
    );
    Object.values(this.renderEntities).forEach((e) => this.updateVisibility(e));
  }

  public zoomOut(): void {
    this.zoomedIn = false;
    this.app.stage.scale = new PIXI.Point(1, 1);
    this.app.stage.position = new PIXI.Point(0, 0);
    Object.values(this.renderEntities).forEach((e) => this.updateVisibility(e));
  }

  public isZoomedIn() {
    return this.zoomedIn;
  }

  public toggleZoom(pos: Pos) {
    if (this.isZoomedIn()) {
      this.zoomOut();
    } else {
      this.zoomTo(pos);
    }
  }

  public clear(): void {
    for (const id of Object.keys(this.renderEntities)) {
      this.removeEntity(id);
    }
    for (const [key, emitter] of Object.entries(this.emitters)) {
      emitter.destroy();
      delete this.emitters[key];
    }
  }

  public addEntity(entity: Required<Entity, "pos" | "display">): void {
    const { pos, display } = entity;
    this.renderEntities[entity.id] = {
      displayComp: { ...display },
      pos: { ...pos },
    };

    if (display.hasBackground) {
      const background = new PIXI.Graphics();
      background.beginFill(this.app.renderer.backgroundColor);
      background.lineStyle(0);
      background.drawRect(0, 0, this.tileWidth, this.tileHeight);
      background.endFill();
      background.position = new PIXI.Point(
        pos.x * this.tileWidth,
        pos.y * this.tileHeight,
      );

      this.renderEntities[entity.id].background = background;
      this.getLayer(display.priority).addChild(background);
    }

    const sprite = this.createSprite(pos, display);
    this.renderEntities[entity.id].sprite = sprite;
    this.getLayer(display.priority).addChild(sprite);

    this.updateVisibility(this.renderEntities[entity.id]);
  }

  updateEntity(entity: Required<Entity, "display" | "pos">): void {
    const renderEntity = this.renderEntities[entity.id];
    if (renderEntity) {
      if (!arePositionsEqual(renderEntity.pos, entity.pos)) {
        renderEntity.pos = entity.pos;
        if (renderEntity.sprite) {
          this.setSpritePosition(
            renderEntity.sprite,
            renderEntity.pos,
            renderEntity.displayComp,
          );
        }
        if (renderEntity.background) {
          renderEntity.background.position.set(
            entity.pos.x * this.tileWidth,
            entity.pos.y * this.tileHeight,
          );
        }
        if (entity.id === PLAYER_ID && this.zoomedIn) {
          this.zoomTo(entity.pos);
        }
      }

      if (
        renderEntity.displayComp.tile !== entity.display.tile ||
        renderEntity.displayComp.color !== entity.display.color ||
        renderEntity.displayComp.priority !== entity.display.priority ||
        renderEntity.displayComp.rotation !== entity.display.rotation ||
        renderEntity.displayComp.hasBackground !== entity.display.hasBackground
      ) {
        this.reAddEntity(entity);
      }

      this.updateVisibility(renderEntity);
    }
  }

  public removeEntity(entityId: string): void {
    const renderEntity = this.renderEntities[entityId];
    if (renderEntity) {
      delete this.renderEntities[entityId];
      if (renderEntity.background) {
        renderEntity.background.parent.removeChild(renderEntity.background);
      }
      if (renderEntity.sprite) {
        renderEntity.sprite.parent.removeChild(renderEntity.sprite);
      }
    }
  }

  private reAddEntity(entity: Required<Entity, "pos" | "display">): void {
    const renderEntity = this.renderEntities[entity.id];
    const isPlaying =
      renderEntity && renderEntity.sprite instanceof PIXI.AnimatedSprite
        ? renderEntity.sprite.playing
        : false;
    this.removeEntity(entity.id);
    this.addEntity(entity);
    if (renderEntity && renderEntity.sprite instanceof PIXI.AnimatedSprite) {
      if (isPlaying) {
        this.playAnimation(entity.id);
      } else {
        this.stopAnimation(entity.id);
      }
    }
  }

  public playAnimation(entityId: string): void {
    const renderEntity = this.renderEntities[entityId];
    if (
      renderEntity &&
      renderEntity.sprite &&
      renderEntity.sprite instanceof PIXI.AnimatedSprite
    ) {
      renderEntity.sprite.play();
    }
  }

  public stopAnimation(entityId: string): void {
    const renderEntity = this.renderEntities[entityId];
    if (
      renderEntity &&
      renderEntity.sprite &&
      renderEntity.sprite instanceof PIXI.AnimatedSprite
    ) {
      renderEntity.sprite.stop();
    }
  }

  private createSprite(pos: Pos, display: Display) {
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
    this.setSpritePosition(sprite, pos, display);
    sprite.width = this.tileWidth;
    sprite.height = this.tileHeight;
    sprite.tint = parseInt((display.color || "#FFFFFF").substr(1), 16);

    return sprite;
  }

  private setSpritePosition(sprite: PIXI.Sprite, pos: Pos, display: Display) {
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
    sprite.position.set(x * this.tileWidth, y * this.tileHeight);
  }

  private getLayer(priority: number) {
    if (this.layers[priority]) {
      return this.layers[priority];
    }
    const layer = new PIXI.Container();
    layer.name = priority.toString();
    this.layers[priority] = layer;
    this.app.stage.addChild(layer);
    this.app.stage.children.sort((a, b) => {
      const aPriority = parseFloat(a.name || "0") || 0;
      const bPriority = parseFloat(b.name || "0") || 0;
      return aPriority - bPriority;
    });
    return layer;
  }

  private updateVisibility(renderEntity: RenderEntity): void {
    const wasVisible = renderEntity.isVisible;
    const isVisible = this.isPosVisible(renderEntity.pos);
    // eslint-disable-next-line no-param-reassign
    renderEntity.isVisible = isVisible;
    if (isVisible && !wasVisible && renderEntity.displayComp.flashWhenVisible) {
      this.flash(renderEntity.pos, renderEntity.displayComp.color);
    }
  }

  private isPosVisible(pos: Pos) {
    if (this.zoomedIn) {
      const xMin = this.app.stage.position.x / (this.tileWidth * -2);
      const yMin = this.app.stage.position.y / (this.tileHeight * -2);
      const xMax = xMin + this.gridWidth / 2;
      const yMax = yMin + this.gridHeight / 2;
      return pos.x >= xMin && pos.x < xMax && pos.y >= yMin && pos.y < yMax;
    } else {
      return (
        pos.x >= 0 &&
        pos.x < this.gridWidth &&
        pos.y >= 0 &&
        pos.y < this.gridHeight
      );
    }
  }

  public setBackgroundColor(color: string) {
    this.app.renderer.backgroundColor = hexToNumber(color);
    Object.entries(this.renderEntities)
      .filter(([id, entity]) => entity.background)
      .forEach(([id, entity]) =>
        this.reAddEntity({
          id,
          display: entity.displayComp,
          pos: entity.pos,
          template: "NONE",
        }),
      );
  }

  public addSmoke(pos: Pos, offset: Pos): void {
    if (!this.loadPromise) return;
    this.loadPromise.then(() => {
      const key = `${pos.x},${pos.y},${offset.x},${offset.y}`;
      if (this.emitters[key]) {
        this.emitters[key].spawnChance = 1;
        return;
      }
      const texture = PIXI.Texture.WHITE;
      const emitter = new particles.Emitter(this.app.stage, [texture], {
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
          x: pos.x * this.tileWidth + offset.x,
          y: pos.y * this.tileHeight + offset.y,
        },
        addAtBack: false,
        spawnType: "point",
      });
      this.emitters[key] = emitter;
    });
  }

  public stopSmoke(pos: Pos, offset: Pos): void {
    const key = `${pos.x},${pos.y},${offset.x},${offset.y}`;
    const emitter = this.emitters[key];
    if (emitter) {
      emitter.spawnChance = 0;
    }
  }

  public removeSmoke(pos: Pos, offset: Pos): void {
    const key = `${pos.x},${pos.y},${offset.x},${offset.y}`;
    const emitter = this.emitters[key];
    if (emitter) {
      emitter.destroy();
    }
    delete this.emitters[key];
  }

  public flash(pos: Pos, color: string): void {
    if (!this.loadPromise) return;
    this.loadPromise.then(() => {
      const texture = PIXI.Texture.WHITE;
      new particles.Emitter(this.app.stage, [texture], {
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
          x: pos.x * this.tileWidth + this.tileWidth / 2,
          y: pos.y * this.tileHeight + this.tileHeight / 2,
        },
        addAtBack: false,
        spawnType: "point",
      }).playOnceAndDestroy();
    });
  }

  public start(): void {
    if (!this.loadPromise) return;
    this.loadPromise.then(() => {
      let lastTime = Date.now();
      const update = () => {
        requestAnimationFrame(update);
        const now = Date.now();
        Object.values(this.emitters).forEach((emitter) => {
          emitter.update((now - lastTime) / 1000);
        });
        lastTime = now;
      };
      update();
    });
  }

  public getClientRectFromPos(gamePos: Pos): ClientRect {
    const canvas = this.app.view;
    const canvasParent = canvas.parentElement;
    if (!canvasParent) throw new Error("App canvas is not in document");
    const scaleX = (this.gridWidth * this.tileWidth) / canvasParent.clientWidth;
    const scaleY =
      (this.gridHeight * this.tileHeight) / canvasParent.clientHeight;
    if (!this.zoomedIn) {
      const width = this.tileWidth / scaleX;
      const height = this.tileHeight / scaleY;
      const left =
        canvasParent.getBoundingClientRect().left +
        (gamePos.x * this.tileWidth) / scaleX;
      const right = left + width;
      const top =
        canvasParent.getBoundingClientRect().top +
        (gamePos.y * this.tileHeight) / scaleY;
      const bottom = top + height;
      return { width, height, left, right, top, bottom };
    } else {
      const stageX = this.app.stage.position.x / this.tileWidth / -2;
      const stageY = this.app.stage.position.y / this.tileHeight / -2;
      const width = (this.tileWidth * 2) / scaleX;
      const height = (this.tileHeight * 2) / scaleY;
      const left =
        canvasParent.getBoundingClientRect().left +
        ((gamePos.x - stageX) * this.tileWidth * 2) / scaleX;
      const right = left + width;
      const top =
        canvasParent.getBoundingClientRect().top +
        ((gamePos.y - stageY) * this.tileHeight * 2) / scaleY;
      const bottom = top + height;
      return { width, height, left, right, top, bottom };
    }
  }

  getPosFromMouse(mouseX: number, mouseY: number): Pos {
    const canvas = this.app.view;
    const canvasParent = canvas.parentElement;
    if (!canvasParent) throw new Error("App canvas is not in document");
    const scaleX = (this.gridWidth * this.tileWidth) / canvasParent.clientWidth;
    const scaleY =
      (this.gridHeight * this.tileHeight) / canvasParent.clientHeight;
    const scaledMouseX = mouseX * scaleX;
    const scaledMouseY = mouseY * scaleY;
    if (!this.zoomedIn) {
      return {
        x: Math.floor(scaledMouseX / this.tileWidth),
        y: Math.floor(scaledMouseY / this.tileHeight),
      };
    } else {
      const offsetX = Math.floor(scaledMouseX / this.tileWidth / 2);
      const offsetY = Math.floor(scaledMouseY / this.tileHeight / 2);
      const stageX = this.app.stage.position.x / this.tileWidth / -2;
      const stageY = this.app.stage.position.y / this.tileHeight / -2;
      return {
        x: stageX + offsetX,
        y: stageY + offsetY,
      };
    }
  }

  public getLoadPromise() {
    return this.loadPromise || Promise.reject();
  }

  public appendView(el: HTMLElement) {
    el.appendChild(this.app.view);
  }
}

function hexToNumber(hex: string): number {
  return parseInt(hex.startsWith("#") ? hex.substr(1) : hex, 16);
}
