import React from "react";
import { HEADER_CSS_WIDTH } from "../constants";
import { ControlCode } from "../types/ControlCode";
import { HotkeyGroup, useControl } from "./HotkeysProvider";
import Kbd from "./Kbd";
import { RouterPageProps } from "./Router";
import { useSettings } from "./SettingsProvider";

export default function Header({ navigateTo }: RouterPageProps) {
  const [settings] = useSettings();
  const menuShortcuts = settings.keybindings[ControlCode.Menu];

  useControl({
    code: ControlCode.Menu,
    group: HotkeyGroup.Menu,
    callback: () => navigateTo("MainMenu"),
  });

  return (
    <header className="flex-none bg-darkGray border-b border-gray">
      <div
        className="mx-auto py-1 px-2 flex flex-row"
        style={{ width: HEADER_CSS_WIDTH }}
      >
        <h1 className="font-bold flex-1">Reflector: Laser Defense</h1>
        <button onClick={() => navigateTo("MainMenu")} type="button">
          <Kbd light>{menuShortcuts[0]}</Kbd> Menu
        </button>
      </div>
    </header>
  );
}
