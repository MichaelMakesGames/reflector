import * as clack from "@reasonink/clack";
import { useEffect, useContext, useState, useCallback } from "react";
import { ControlCode } from "~types/ControlCode";
import { SettingsContext } from "~contexts";

export function useControl(
  controlCode: ControlCode,
  callback: (e: KeyboardEvent) => void,
  enabled: boolean = true,
  modifiers: string[] = [""],
): void {
  const settings = useContext(SettingsContext);
  let group = clack.group({});

  useEffect(() => {
    const shortcuts = modifiers.reduce<string[]>((acc, cur) => {
      return [
        ...acc,
        ...settings.keyboardShortcuts[controlCode].map((shortcut) =>
          cur ? `${cur} ${shortcut}` : shortcut,
        ),
      ];
    }, []);
    // prevent defaults to disable browser shortcuts where possible
    const shortcutsWithPreventDefault = shortcuts.reduce<
      Record<string, (e: KeyboardEvent) => void>
    >((acc, cur) => {
      acc[cur] = (e: KeyboardEvent) => {
        e.preventDefault();
        callback(e);
      };
      return acc;
    }, {});

    group = clack.group(shortcutsWithPreventDefault);
    group.enabled = enabled;
    return () => {
      group.enabled = false;
    };
  });
}

export function useBoolean(
  initialValue: boolean,
): [boolean, () => void, () => void, () => void] {
  const [value, setValue] = useState(initialValue);
  const setTrue = useCallback(() => setValue(true), [setValue]);
  const setFalse = useCallback(() => setValue(false), [setValue]);
  const toggle = useCallback(() => setValue(!value), [setValue, value]);
  return [value, setTrue, setFalse, toggle];
}
