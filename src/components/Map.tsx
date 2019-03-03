import React, { useEffect } from "react";
import * as ROT from "rot-js";
import { useMappedState } from "redux-react-hook";

import * as selectors from "../redux/selectors";
import {
  MAP_WIDTH,
  MAP_HEIGHT,
  BACKGROUND_COLOR,
  FONT_SIZE,
  FONT_FAMILY
} from "../constants";

const display = new ROT.Display({
  width: MAP_WIDTH,
  height: MAP_HEIGHT,
  forceSquareRatio: true,
  bg: BACKGROUND_COLOR,
  fontSize: FONT_SIZE,
  fontFamily: FONT_FAMILY
});

export default function Map() {
  const gameState = useMappedState(selectors.gameState);

  useEffect(() => {
    const container = display.getContainer();
    const map = document.getElementById("map");
    if (container && map) {
      map.appendChild(container);
    }
  }, []);

  display.clear();
  Object.values(gameState.entities).forEach(entity => {
    if (entity.position && entity.glyph) {
      const { position, glyph } = entity;
      display.draw(
        position.x,
        position.y,
        glyph.glyph,
        glyph.color,
        BACKGROUND_COLOR
      );
    }
  });

  return <div id="map" />;
}
