import * as clack from "@reasonink/clack";
import { useEffect } from "react";
import controls, { ControlCode } from "~data/controls";

export function useControl(
  controlCode: ControlCode,
  callback: (e: KeyboardEvent) => void,
  enabled: boolean = true,
): void {
  let group = clack.group({});

  useEffect(() => {
    const shortcuts = controls[controlCode];
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
