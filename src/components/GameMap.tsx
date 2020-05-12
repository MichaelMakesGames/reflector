/* global document */
import React, { useEffect } from "react";

import { app } from "~/renderer";

export default function GameMap() {
  useEffect(() => {
    const map = document.getElementById("map");
    if (map) {
      map.appendChild(app.view);
    }
  }, []);

  return (
    <section>
      <div id="map" />
    </section>
  );
}
