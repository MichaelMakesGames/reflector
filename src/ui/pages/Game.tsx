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
    <main className="h-full w-full">
      <div className="h-full w-full absolute">
        <GameMap {...props} />
      </div>
      <div className="absolute top-0 bg-black left-1/2 translate-x-[-50%] border-gray border-x">
        <Header {...props} />
      </div>
      <div className="flex flex-row flex-1 w-full max-w-screen-xl mx-auto">
        <div className="flex-none w-64 flex flex-col border-r border-gray z-10 bg-black absolute left-0">
          <Status />
          <Laser />
          <Resources />
          <Jobs />
        </div>
        <div className="absolute bottom-0 bg-black left-1/2 translate-x-[-50%] border-gray border-x">
          <BottomMenu />
        </div>
        <div className="flex-none w-64 flex flex-col border-l border-b border-gray z-10 bg-black absolute right-0">
          <Tutorials />
          <Inspector />
        </div>
      </div>
      <GameOver navigateTo={navigateTo} />
      <Introduction />
    </main>
  );
}
