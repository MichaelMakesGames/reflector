import React, { useEffect, useRef } from "react";
import { Object } from "ts-toolbelt";
import colors from "../colors";
import { TILE_SIZE } from "../constants";
import { createEntityFromTemplate } from "../lib/entities";
import { rangeFromTo } from "../lib/math";
import Renderer from "../renderer/Renderer";
import { Entity } from "../types";

const WIDTH = 12;
const HEIGHT = 5.25;

export default function MainTitle() {
  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (divRef.current) {
      divRef.current.childNodes.forEach((child) => child.remove());
      const renderer = new Renderer({
        gridWidth: WIDTH,
        gridHeight: HEIGHT,
        tileWidth: TILE_SIZE,
        tileHeight: TILE_SIZE,
        appWidth: WIDTH * TILE_SIZE,
        appHeight: HEIGHT * TILE_SIZE,
        backgroundColor: colors.background,
        autoCenterEnabled: false,
      });
      renderer.start();
      renderer.addEntity(
        createEntityFromTemplate("PLAYER", {
          pos: { x: 0, y: 2 },
        }) as Object.Required<Entity, "pos" | "display">
      );
      renderer.addEntity(
        createEntityFromTemplate("REFLECTOR_DOWN_RIGHT", {
          pos: { x: 0, y: 4 },
        }) as Object.Required<Entity, "pos" | "display">
      );
      renderer.addEntity(
        createEntityFromTemplate("LASER_PLAYER_DOWN", {
          pos: { x: 0, y: 2 },
        }) as Object.Required<Entity, "pos" | "display">
      );
      renderer.addEntity(
        createEntityFromTemplate("LASER_VERTICAL", {
          pos: { x: 0, y: 3 },
        }) as Object.Required<Entity, "pos" | "display">
      );
      renderer.addEntity(
        createEntityFromTemplate("LASER_REFLECTED_UP_RIGHT", {
          pos: { x: 0, y: 4 },
        }) as Object.Required<Entity, "pos" | "display">
      );
      for (const x of rangeFromTo(1, WIDTH)) {
        renderer.addEntity(
          createEntityFromTemplate("LASER_HORIZONTAL", {
            pos: { x, y: 4 },
          }) as Object.Required<Entity, "pos" | "display">
        );
      }
      // renderer.addEntity(
      //   createEntityFromTemplate("LASER_BURST", {
      //     pos: { x: WIDTH - 1, y: 4 },
      //   }) as Object.Required<Entity, "pos" | "display">
      // );
      renderer.appendView(divRef.current);
      return () => renderer.destroy();
    }
    return undefined;
  }, [divRef.current]);

  return (
    <div className="relative mx-auto" style={{ width: WIDTH * TILE_SIZE }}>
      <div
        style={{
          width: WIDTH * TILE_SIZE,
          height: HEIGHT * TILE_SIZE,
        }}
        ref={divRef}
      />
      <div className="absolute top-0 mt-3 font-mono w-full">
        <div className="text-5xl text-center">Reflector</div>
        <div className="mt-2 text-4xl">
          <span className="opacity-0 mr-0">L</span>aser Defense
        </div>
      </div>
    </div>
  );
}
