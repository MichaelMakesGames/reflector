import * as clack from "@reasonink/clack";
import { useEffect } from "react";

export function useShortcuts(
  shortcuts: Record<string, (e: KeyboardEvent) => void>,
  enabled: boolean = true,
): clack.Group {
  let group = clack.group({});

  useEffect(() => {
    // prevent defaults to disable browser shortcuts where possible
    const shortcutsWithPreventDefault = Object.entries(shortcuts).reduce<
      Record<string, (e: KeyboardEvent) => void>
    >((acc, cur) => {
      acc[cur[0]] = (e: KeyboardEvent) => {
        e.preventDefault();
        cur[1](e);
      };
      return acc;
    }, {});

    group = clack.group(shortcutsWithPreventDefault);
    group.enabled = enabled;
    return () => {
      group.enabled = false;
    };
  });

  return group;
}
