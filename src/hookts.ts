import * as clack from "@reasonink/clack";
import { useEffect } from "react";

export function useShortcuts(
  shortcuts: Record<string, (e: KeyboardEvent) => void>,
  enabled: boolean = true,
): clack.Group {
  let group = clack.group({});
  useEffect(() => {
    group = clack.group(shortcuts);
    group.enabled = enabled;
    return () => {
      group.enabled = false;
    };
  });
  return group;
}
