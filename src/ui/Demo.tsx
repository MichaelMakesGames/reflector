import React, { useEffect, useRef, useState } from "react";
import colors from "../colors";
import { TILE_SIZE } from "../constants";
import DummyAudio from "../lib/audio/DummyAudio";
import { createEntityFromTemplate } from "../lib/entities";
import { rangeFromTo, rangeTo } from "../lib/math";
import Renderer from "../renderer/Renderer";
import { createInitialState } from "../state/initialState";
import { cosmeticSystems } from "../state/systems";
import wrapState from "../state/wrapState";
import { RawState } from "../types";
import { Demo as DemoComp } from "../types/Entity";
import WrappedState from "../types/WrappedState";

export default function Demo({ demoComp }: { demoComp: DemoComp }) {
  const divRef = useRef<HTMLDivElement | null>(null);
  const [demoState, setDemoState] = useState<WrappedState | null>(null);
  const [initialState, setInitialState] = useState<RawState | null>(null);
  const [actionIndex, setActionIndex] = useState<number>(0);

  useEffect(() => {
    const [renderer, wrappedState] = setUpDemo(demoComp);
    setDemoState(wrappedState);
    setInitialState(wrappedState.raw);
    setActionIndex(0);
    if (divRef.current) {
      divRef.current.childNodes.forEach((child) =>
        divRef.current?.removeChild?.(child)
      );
      renderer.appendView(divRef.current);
    }
    return () => renderer.destroy();
  }, [demoComp]);

  useEffect(() => {
    if (demoState && initialState) {
      const action = demoComp.actions[actionIndex];
      if (!action) {
        demoState.act.loadGame({ state: initialState });
        setActionIndex(0);
        return () => {};
      } else if (typeof action === "number") {
        const ms = action;
        const timeoutId = setTimeout(
          () => setActionIndex((prev) => prev + 1),
          ms
        );
        return () => clearTimeout(timeoutId);
      } else {
        demoState.handle(action);
        setActionIndex((prev) => prev + 1);
        return () => {};
      }
    }
    return () => {};
  }, [actionIndex, demoState]);

  return (
    <div
      style={{
        width: demoComp.width * TILE_SIZE,
        height: demoComp.height * TILE_SIZE,
      }}
      ref={divRef}
    />
  );
}

function setUpDemo(demoComp: DemoComp): [Renderer, WrappedState] {
  const rawState = createInitialState({
    mapType: "standard",
    completedTutorials: [],
  });
  const renderer = new Renderer({
    gridWidth: demoComp.width,
    gridHeight: demoComp.height,
    tileWidth: TILE_SIZE,
    tileHeight: TILE_SIZE,
    backgroundColor: colors.backgroundDay,
  });
  const audio = new DummyAudio();
  const save = () => {};
  const state = wrapState(rawState, renderer, audio, save);

  // add demo entities
  for (const [id, [templateName, additionalComponents]] of Object.entries(
    demoComp.entities
  )) {
    let entity = createEntityFromTemplate(templateName, additionalComponents);
    entity = { ...entity, id };
    state.act.addEntity(entity);
  }

  // fill in ground where there's no other terrain
  for (const x of rangeTo(demoComp.width)) {
    for (const y of rangeTo(demoComp.height)) {
      const entities = state.select.entitiesAtPosition({ x, y });
      if (!entities.some((e) => e.template.startsWith("TERRAIN"))) {
        state.act.addEntity(
          createEntityFromTemplate("TERRAIN_GROUND", { pos: { x, y } })
        );
      }
    }
  }

  // add border indestructible walls
  for (const x of [-2, demoComp.width + 1]) {
    for (const y of rangeFromTo(-2, demoComp.height + 1)) {
      state.act.addEntity(
        createEntityFromTemplate("BUILDING_WALL", {
          pos: { x, y },
          destructible: undefined,
        })
      );
    }
  }
  for (const x of rangeFromTo(-2, demoComp.width + 1)) {
    for (const y of [-2, demoComp.height + 1]) {
      state.act.addEntity(
        createEntityFromTemplate("BUILDING_WALL", {
          pos: { x, y },
          destructible: undefined,
        })
      );
    }
  }

  // add a position-less colonist to avoid 0 population defeat
  state.act.addEntity(createEntityFromTemplate("COLONIST"));

  cosmeticSystems.forEach((system) => system(state));

  renderer.setLoadPromise(Promise.resolve());
  renderer.start();

  return [renderer, state];
}
