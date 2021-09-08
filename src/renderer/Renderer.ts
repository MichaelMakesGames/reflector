import { nanoid } from "nanoid";
import * as particles from "pixi-particles";
import * as PIXI from "pixi.js";
import { Required } from "ts-toolbelt/out/Object/Required";
import colors from "../colors";
import { PLAYER_ID, PRIORITY_BUILDING_DETAIL, UP } from "../constants";
import { arePositionsEqual, getPositionToDirection } from "../lib/geometry";
import { Display, Entity, Pos } from "../types";

const BASE_SPEED = 3;

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
  sprite: PIXI.Sprite;
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

  private movementPaths: Map<string, Pos[]> = new Map();

  private previousStage: { scale: number; x: number; y: number } = {
    scale: 1,
    x: 0,
    y: 0,
  };

  private desiredStage: { scale: number; x: number; y: number } = {
    scale: 1,
    x: 0,
    y: 0,
  };

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
          }))
        )
        .load(resolve)
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
    this.previousStage = {
      scale: this.app.stage.scale.x,
      x: this.app.stage.position.x,
      y: this.app.stage.position.y,
    };
    this.desiredStage = {
      scale: 2,
      x: -x * this.tileWidth * 2,
      y: -y * this.tileHeight * 2,
    };
    Object.values(this.renderEntities).forEach((e) => this.updateVisibility(e));
  }

  public zoomOut(): void {
    this.zoomedIn = false;
    this.previousStage = {
      scale: this.app.stage.scale.x,
      x: this.app.stage.position.x,
      y: this.app.stage.position.y,
    };
    this.desiredStage = {
      scale: 1,
      x: 0,
      y: 0,
    };
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
    const sprite = this.createSprite(pos, display);

    this.renderEntities[entity.id] = {
      displayComp: { ...display },
      pos: { ...pos },
      sprite,
    };

    if (display.hasBackground) {
      const background = new PIXI.Graphics();
      background.beginFill(this.app.renderer.backgroundColor);
      background.lineStyle(0);
      background.drawRect(0, 0, this.tileWidth, this.tileHeight);
      background.endFill();
      background.position.x = pos.x * this.tileWidth;
      background.position.y = pos.y * this.tileHeight;

      this.renderEntities[entity.id].background = background;
      this.getLayer(display.priority).addChild(background);
    }
    this.getLayer(display.priority).addChild(sprite);

    this.updateVisibility(this.renderEntities[entity.id]);
  }

  updateEntity(entity: Required<Entity, "display" | "pos">): void {
    const renderEntity = this.renderEntities[entity.id];
    if (renderEntity) {
      if (!arePositionsEqual(renderEntity.pos, entity.pos)) {
        renderEntity.pos = entity.pos;
        if (renderEntity.displayComp.discreteMovement) {
          this.setSpritePosition(
            renderEntity.sprite,
            renderEntity.pos,
            renderEntity.displayComp
          );
        } else if (this.movementPaths.has(entity.id)) {
          (this.movementPaths.get(entity.id) || []).push(entity.pos);
        } else {
          this.movementPaths.set(entity.id, [entity.pos]);
        }

        if (renderEntity.background) {
          renderEntity.background.position.set(
            entity.pos.x * this.tileWidth,
            entity.pos.y * this.tileHeight
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
      if (this.movementPaths.has(entityId)) {
        this.movementPaths.delete(entityId);
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
        PIXI.utils.TextureCache[display.tile || "unknown"]
      );
    } else {
      sprite = new PIXI.AnimatedSprite(
        display.tile.map((tile) => PIXI.utils.TextureCache[tile || "unknown"])
      );
      (sprite as PIXI.AnimatedSprite).animationSpeed = display.speed || 0.2;
      (sprite as PIXI.AnimatedSprite).play();
    }
    sprite.pivot.set(this.tileWidth / 2, this.tileHeight / 2);
    sprite.angle = display.rotation || 0;
    this.setSpritePosition(sprite, pos, display);
    sprite.width = this.tileWidth * (display.width || 1);
    sprite.height = this.tileHeight * (display.height || 1);
    sprite.tint = parseInt((display.color || "#FFFFFF").substr(1), 16);

    return sprite;
  }

  private setSpritePosition(sprite: PIXI.Sprite, pos: Pos, display: Display) {
    const { x, y } = this.calcAppPos(pos, display);
    sprite.position.set(x, y);
  }

  private calcAppPos(pos: Pos, display: Display): Pos {
    const { x, y } = pos;
    return {
      x: x * this.tileWidth + this.tileWidth / 2 + (display.offsetX || 0),
      y: y * this.tileHeight + this.tileHeight / 2 + (display.offsetY || 0),
    };
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
      const xMin = this.desiredStage.x / (this.tileWidth * -2);
      const yMin = this.desiredStage.y / (this.tileHeight * -2);
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
        })
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

  public explode(pos: Pos): void {
    if (!this.loadPromise) return;
    this.loadPromise.then(() => {
      const texture = PIXI.Texture.WHITE;
      const config: particles.EmitterConfig = {
        alpha: {
          list: [
            { value: 1, time: 0 },
            { value: 1, time: 0.75 },
            { value: 0, time: 1 },
          ],
        },

        scale: {
          list: [
            { value: 1 / 2, time: 0 },
            { value: 1 / 2, time: 1 },
          ],
        },
        color: {
          list: [
            { value: colors.power, time: 0 },
            { value: colors.laser, time: 0.5 },
            { value: colors.ground, time: 0.75 },
            { value: colors.ground, time: 1 },
          ],
        },
        speed: {
          list: [
            { value: 100, time: 0 },
            { value: 100, time: 0.75 },
            { value: 50, time: 1 },
          ],
        },
        acceleration: {
          x: 0,
          y: 0,
        },
        maxSpeed: 0,
        startRotation: {
          min: 0,
          max: 360,
        },
        noRotation: true,
        lifetime: {
          min: 0.3,
          max: 0.3,
        },
        frequency: 0.02,
        emitterLifetime: 0.1,
        maxParticles: 1000,
        particlesPerWave: 20,
        pos: {
          x: pos.x * this.tileWidth + this.tileWidth / 2,
          y: pos.y * this.tileHeight + this.tileHeight / 2,
        },
        addAtBack: false,
        spawnType: "point",
      };
      new particles.Emitter(
        this.app.stage,
        [texture],
        config
      ).playOnceAndDestroy();
    });
  }

  public dustCloud(pos: Pos): void {
    if (!this.loadPromise) return;
    this.loadPromise.then(() => {
      const texture = PIXI.Texture.WHITE;
      const config: particles.EmitterConfig = {
        alpha: {
          list: [
            { value: 1, time: 0 },
            { value: 0, time: 1 },
          ],
        },
        scale: {
          list: [
            { value: 1 / 2, time: 0 },
            { value: 1 / 2, time: 1 },
          ],
        },
        color: {
          list: [{ value: colors.ground, time: 0 }],
        },
        speed: {
          list: [
            { value: 50, time: 0 },
            { value: 25, time: 1 },
          ],
        },
        acceleration: {
          x: 0,
          y: 0,
        },
        maxSpeed: 0,
        startRotation: {
          min: 240,
          max: 300,
        },
        noRotation: true,
        lifetime: {
          min: 0.25,
          max: 0.5,
        },
        frequency: 0.02,
        emitterLifetime: 0.1,
        maxParticles: 1000,
        particlesPerWave: 10,
        pos: {
          x: pos.x * this.tileWidth,
          y: pos.y * this.tileHeight,
        },
        addAtBack: false,
        spawnType: "rect",
        spawnRect: {
          x: 0,
          y: this.tileHeight / 2,
          w: this.tileWidth,
          h: this.tileHeight / 2,
        },
      };
      new particles.Emitter(
        this.app.stage,
        [texture],
        config
      ).playOnceAndDestroy();
    });
  }

  public start(): void {
    if (!this.loadPromise) return;
    this.loadPromise.then(() => {
      this.app.ticker.add((delta: number) =>
        Object.values(this.emitters).forEach((emitter) =>
          emitter.update(delta / 60)
        )
      );
      this.app.ticker.add((delta: number) => this.handleMovement(delta));
      this.app.ticker.add((delta: number) => this.handleStageTransition(delta));
    });
  }

  public bump(entityId: string, towardsPos: Pos): void {
    let path = this.movementPaths.get(entityId);
    if (!path) {
      path = [];
      this.movementPaths.set(entityId, path);
    }
    const renderEntity = this.renderEntities[entityId];
    if (!renderEntity) return;
    const { pos } = renderEntity;
    path.push(
      { x: (pos.x + towardsPos.x) / 2, y: (pos.y + towardsPos.y) / 2 },
      pos
    );
  }

  private handleMovement(delta: number) {
    for (const [entityId, path] of this.movementPaths.entries()) {
      const entity = this.renderEntities[entityId];
      if (!entity || !path.length) {
        this.movementPaths.delete(entityId);
      } else {
        const speed = BASE_SPEED * path.length;
        const oldX = entity.sprite.x;
        const oldY = entity.sprite.y;
        const { x: destX, y: destY } = this.calcAppPos(
          path[0],
          entity.displayComp
        );
        const deltaX = destX - oldX;
        const deltaY = destY - oldY;
        let newX = oldX;
        let newY = oldY;
        if (Math.abs(deltaX) <= speed * delta) {
          newX = destX;
        } else if (deltaX > 0) {
          newX = oldX + speed * delta;
        } else {
          newX = oldX - speed * delta;
        }
        if (Math.abs(deltaY) <= speed * delta) {
          newY = destY;
        } else if (deltaY > 0) {
          newY = oldY + speed * delta;
        } else {
          newY = oldY - speed * delta;
        }

        if (newY === destY && newX === destX) {
          path.shift();
        }

        entity.sprite.position.set(newX, newY);
      }
    }
  }

  private handleStageTransition(delta: number) {
    const DURATION = 8;
    const speedScale =
      Math.abs(this.previousStage.scale - this.desiredStage.scale) / DURATION;
    const speedX =
      Math.abs(this.previousStage.x - this.desiredStage.x) / DURATION;
    const speedY =
      Math.abs(this.previousStage.y - this.desiredStage.y) / DURATION;

    const oldScale = this.app.stage.scale.x;
    const oldX = this.app.stage.x;
    const oldY = this.app.stage.y;

    // const { x: destX, y: destY } = this.calcAppPos(
    //   path[0],
    //   entity.displayComp
    // );
    const deltaScale = this.desiredStage.scale - oldScale;
    const deltaX = this.desiredStage.x - oldX;
    const deltaY = this.desiredStage.y - oldY;

    let newScale = oldScale;
    let newX = oldX;
    let newY = oldY;

    if (Math.abs(deltaScale) <= speedScale * delta) {
      newScale = this.desiredStage.scale;
    } else if (deltaScale > 0) {
      newScale = oldScale + speedScale * delta;
    } else {
      newScale = oldScale - speedScale * delta;
    }
    if (Math.abs(deltaX) <= speedX * delta) {
      newX = this.desiredStage.x;
    } else if (deltaX > 0) {
      newX = oldX + speedX * delta;
    } else {
      newX = oldX - speedX * delta;
    }
    if (Math.abs(deltaY) <= speedY * delta) {
      newY = this.desiredStage.y;
    } else if (deltaY > 0) {
      newY = oldY + speedY * delta;
    } else {
      newY = oldY - speedY * delta;
    }

    this.app.stage.scale.x = newScale;
    this.app.stage.scale.y = newScale;
    this.app.stage.position.x = newX;
    this.app.stage.position.y = newY;
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
      const stageX = this.desiredStage.x / this.tileWidth / -2;
      const stageY = this.desiredStage.y / this.tileHeight / -2;
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
      const stageX = this.desiredStage.x / this.tileWidth / -2;
      const stageY = this.desiredStage.y / this.tileHeight / -2;
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

  public flashTile(pos: Pos, tile: string, color: string) {
    // set timeout to give entities time to move
    setTimeout(() => {
      const id = nanoid();
      this.addEntity({
        template: "NONE",
        id,
        pos,
        display: {
          tile,
          color,
          priority: PRIORITY_BUILDING_DETAIL,
        },
      });
      this.movementPaths.set(id, [getPositionToDirection(pos, UP)]);
      setTimeout(() => this.removeEntity(id), 500);
    }, 50);
  }
}

function hexToNumber(hex: string): number {
  return parseInt(hex.startsWith("#") ? hex.substr(1) : hex, 16);
}
