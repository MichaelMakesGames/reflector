/* global document */
import React, { useEffect } from "react";

import { app } from "~/renderer";

export default function Map() {
  useEffect(() => {
    const map = document.getElementById("map");
    if (map) {
      map.appendChild(app.view);
    }
  }, []);

  return (
    <div className="box map">
      <div className="box__label">Map</div>
      <div id="map" />
    </div>
  );
}
