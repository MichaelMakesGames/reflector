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
      <div className="flex flex-row flex-1 w-full max-w-screen-lg mx-auto">
        <div className="flex-1 h-full flex flex-col border-l border-gray">
          <Status />
          <Laser />
          <Resources />
          <Jobs />
          <Inspector />
        </div>
        <div className="flex-none h-full border-l border-r border-gray">
          <GameMap />
          <BuildMenu />
        </div>
      </div>
    </main>
  );
}
