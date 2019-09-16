/* global document */
import React, { useEffect } from "react";
import { useMappedState } from "redux-react-hook";

import * as selectors from "../state/selectors";

import { app } from "../renderer";

export default function Map() {
  const currentLevel = useMappedState(selectors.currentLevel);

  useEffect(() => {
    const map = document.getElementById("map");
    if (map) {
      map.appendChild(app.view);
    }
  }, []);

  return (
    <div className="box map">
      <div className="box__label">
        Map, Level {currentLevel ? currentLevel.depth : 0}
      </div>
      <div id="map" />
    </div>
  );
}
