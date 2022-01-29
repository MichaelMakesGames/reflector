/* global document */
import React, { useEffect } from "react";
import colors from "../../colors";
import { MAP_CSS_WIDTH } from "../../constants";
import { ControlCode } from "../../types/ControlCode";
import BottomMenu from "../BottomMenu";
import GameMap from "../GameMap";
import GameOver from "../GameOver";
import Header from "../Header";
import { HotkeyGroup, useControl } from "../HotkeysProvider";
import Inspector from "../Inspector";
import Introduction from "../Introduction";
import Jobs from "../Jobs";
import Laser from "../Laser";
import Resources from "../Resources";
import { RouterPageProps } from "../Router";
import Status from "../Status";
import Tutorials from "../Tutorials";

export default function Game(props: RouterPageProps) {
  const { navigateTo } = props;

  useEffect(() => {
    Object.entries(colors).forEach(([color, value]) =>
      document.body.style.setProperty(`--${color}`, value)
    );
  }, []);

  useControl({
    code: ControlCode.Help,
    callback: () => props.navigateTo("Keybindings"),
    group: HotkeyGroup.Main,
    allowedGroups: [
      HotkeyGroup.Intro,
      HotkeyGroup.GameOver,
      HotkeyGroup.Menu,
      HotkeyGroup.Tutorial,
      HotkeyGroup.JobPriorities,
      HotkeyGroup.BuildingSelection,
    ],
  });

  return (
    <main className="h-full flex flex-col">
      <Header {...props} />
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
          <GameMap {...props} />
          <BottomMenu />
        </div>
        <div className="flex-none w-64 h-full flex flex-col border-l border-r border-gray z-10">
          <Tutorials />
          <Inspector />
        </div>
      </div>
      <GameOver navigateTo={navigateTo} />
      <Introduction />
    </main>
  );
}
