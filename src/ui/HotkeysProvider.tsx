/* global window */
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from "react";
import { ControlCode } from "../types/ControlCode";
import { useSettings } from "./SettingsProvider";

const HotkeyContext = createContext({
  register: (hotkey: Hotkey) => {},
  unregister: (hotkey: Hotkey) => {},
});

export enum HotkeyGroup {
  Main = "MAIN",
  Help = "HELP",
  Menu = "MENU",
  GameOver = "GAME_OVER",
  Intro = "INTRO",
  Loading = "LOADING",
  JobPriorities = "JOB_PRIORITIES",
  BuildingSelection = "BUILDING_SELECTION",
  Tutorial = "Tutorial",
}

const GROUP_PRIORITIES = [
  HotkeyGroup.Help,
  HotkeyGroup.Menu,
  HotkeyGroup.GameOver,
  HotkeyGroup.Intro,
  HotkeyGroup.Loading,
  HotkeyGroup.Tutorial,
  HotkeyGroup.BuildingSelection,
  HotkeyGroup.JobPriorities,
  HotkeyGroup.Main,
];

interface Hotkey {
  key: string;
  group: HotkeyGroup;
  allowedGroups: Set<HotkeyGroup>;
  callback: () => void;
  shift?: boolean;
  alt?: boolean;
  ctrl?: boolean;
  meta?: boolean;
  disabled?: boolean;
}

const KEY_ALIASES: Record<string, string> = {
  space: " ",
  up: "ArrowUp",
  down: "ArrowDown",
  left: "ArrowLeft",
  right: "ArrowRight",
  ctrl: "Control",
  esc: "Escape",
};

export default function HotkeysProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const hotkeysRef = useRef<Set<Hotkey>>(new Set());
  const register = useCallback((hotkey: Hotkey) => {
    hotkeysRef.current.add(hotkey);
  }, []);
  const unregister = useCallback((hotkey: Hotkey) => {
    hotkeysRef.current.delete(hotkey);
  }, []);
  const contextValue = useMemo(() => ({ register, unregister }), []);

  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      const activeGroup = (
        Array.from(hotkeysRef.current)
          .filter((hotkey) => hotkey.group && !hotkey.disabled)
          .sort((a, b) => {
            let aValue = GROUP_PRIORITIES.indexOf(a.group as HotkeyGroup);
            if (aValue === -1) {
              aValue = Infinity;
            }
            let bValue = GROUP_PRIORITIES.indexOf(b.group as HotkeyGroup);
            if (bValue === -1) {
              bValue = Infinity;
            }
            return aValue - bValue;
          })[0] || { group: HotkeyGroup.Main }
      ).group;

      for (const hotkey of hotkeysRef.current) {
        if (
          [
            hotkey.key.toLowerCase(),
            (KEY_ALIASES[hotkey.key.toLowerCase()] || "").toLowerCase(),
          ].includes(event.key.toLowerCase()) &&
          !hotkey.disabled &&
          (hotkey.group === activeGroup ||
            hotkey.allowedGroups.has(activeGroup)) &&
          (hotkey.alt === undefined || hotkey.alt === event.altKey) &&
          (hotkey.ctrl === undefined || hotkey.ctrl === event.ctrlKey) &&
          (hotkey.meta === undefined || hotkey.meta === event.metaKey) &&
          (hotkey.shift === undefined || hotkey.shift === event.shiftKey)
        ) {
          event.preventDefault();
          event.stopPropagation();
          event.cancelBubble = true; // eslint-disable-line no-param-reassign
          hotkey.callback();
          return;
        }
      }
    };
    window.addEventListener("keydown", listener);
    return () => window.removeEventListener("keydown", listener);
  }, []);

  return (
    <HotkeyContext.Provider value={contextValue}>
      {children}
    </HotkeyContext.Provider>
  );
}

export interface ControlConfig {
  code: ControlCode;
  group: HotkeyGroup;
  allowedGroups?: HotkeyGroup[];
  callback: () => void;
  shift?: boolean;
  alt?: boolean;
  ctrl?: boolean;
  meta?: boolean;
  disabled?: boolean;
}
export function useControl({
  code,
  shift,
  alt,
  ctrl,
  meta,
  callback,
  group,
  allowedGroups = [],
  disabled,
}: ControlConfig) {
  const [settings] = useSettings();
  const { register, unregister } = useContext(HotkeyContext);
  useEffect(() => {
    const hotkeys = settings.keybindings[code].map<Hotkey>((unparsedKey) => {
      let parsedKey = unparsedKey;
      let parsedModifier: "alt" | "ctrl" | "meta" | "shift" | "" = "";

      if (unparsedKey.startsWith("alt+")) {
        parsedKey = unparsedKey.substring(4);
        parsedModifier = "alt";
      } else if (unparsedKey.startsWith("ctrl+")) {
        parsedKey = unparsedKey.substring(5);
        parsedModifier = "ctrl";
      } else if (unparsedKey.startsWith("meta+")) {
        parsedKey = unparsedKey.substring(5);
        parsedModifier = "meta";
      } else if (unparsedKey.startsWith("shift+")) {
        parsedKey = unparsedKey.substring(6);
        parsedModifier = "shift";
      }

      return {
        key: parsedKey,
        shift,
        alt,
        ctrl,
        meta,
        callback,
        group,
        allowedGroups: new Set(allowedGroups),
        disabled,
        ...(parsedModifier ? { [parsedModifier]: true } : {}),
      };
    });

    hotkeys.forEach(register);
    return () => hotkeys.forEach(unregister);
  });
}
