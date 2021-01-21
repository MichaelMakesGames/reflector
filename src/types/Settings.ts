import { ControlCode } from "~types/ControlCode";

export default interface Settings {
  aimInSameDirectionToFire: boolean;
  fireKeyActivatesAiming: boolean;
  unmodifiedAiming: boolean;
  unmodifiedBuilding: boolean;
  cursorModifierKey: "alt" | "ctrl" | "meta" | "shift";
  keyboardShortcuts: Record<ControlCode, string[]>;
}
