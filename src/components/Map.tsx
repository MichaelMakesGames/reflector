import React, { useEffect } from "react";
import * as ROT from "rot-js";
import { useMappedState } from "redux-react-hook";

import * as selectors from "../selectors";
import {
  MAP_WIDTH,
  MAP_HEIGHT,
  BACKGROUND_COLOR,
  FONT_SIZE,
  FONT_FAMILY,
  TRANSPARENT,
  PLAYER_ID
} from "../constants";
import { Glyph } from "../types";

const display = new ROT.Display({
  width: MAP_WIDTH,
  height: MAP_HEIGHT,
  forceSquareRatio: true,
  bg: BACKGROUND_COLOR,
  fontSize: Math.min(FONT_SIZE, document.body.clientWidth / MAP_WIDTH),
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
  Object.entries(gameState.entitiesByPosition)
    .filter(([_, ids]) => ids.length)
    .forEach(([key, ids]) => {
      const [x, y] = key.split(",").map(parseFloat);
      const glyphs = ids
        .map(id => gameState.entities[id].glyph)
        .filter(Boolean) as Glyph[];
      glyphs.sort((a, b) => b.priority - a.priority);
      const glyph = glyphs[0];
      display.draw(
        x,
        y,
        glyph.glyph,
        glyph.color,
        glyph.background || TRANSPARENT
      );
    });

  return (
    <div className="box map">
      <div className="box__label">Map</div>
      <div id="map" />
    </div>
  );
}
