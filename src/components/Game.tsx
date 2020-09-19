/* global document */
import React, { useEffect } from "react";
import colors from "~colors";
import BuildMenu from "./BuildMenu";
import GameMap from "./GameMap";
import Header from "./Header";
import Inspector from "./Inspector";
import Jobs from "./Jobs";
import Laser from "./Laser";
import LoadGame from "./LoadGame";
import Resources from "./Resources";
import Status from "./Status";
import IconMasks from "./IconMasks";
import GameOver from "./GameOver";
import { TILE_SIZE, MAP_WIDTH, MAP_CSS_WIDTH } from "~constants";

export default function Game() {
  useEffect(() => {
    Object.entries(colors).forEach(([color, value]) =>
      document.body.style.setProperty(`--${color}`, value),
    );
  }, []);

  return (
    <main className="h-full flex flex-col">
      <Header />
      <LoadGame />
      <div className="flex flex-row flex-1 w-full max-w-screen-xl mx-auto">
        <div className="flex-none w-64 h-full flex flex-col border-l border-r border-gray z-10">
          <Status />
          <Laser />
          <Resources />
          <Jobs />
        </div>
        <div
          className="flex-none h-full border-gray"
          style={{
            width: MAP_CSS_WIDTH,
          }}
        >
          <GameMap />
          <BuildMenu />
        </div>
        <div className="flex-none w-64 h-full flex flex-col border-l border-r border-gray z-10">
          <Inspector />
        </div>
      </div>
      <IconMasks />
      <GameOver />
    </main>
  );
}
