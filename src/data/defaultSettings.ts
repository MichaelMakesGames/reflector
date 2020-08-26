import Settings from "~types/Settings";
import { ControlCode } from "../types/ControlCode";

const defaultSettings: Settings = {
  aimingModifierKey: "shift",
  cursorModifierKey: "alt",
  fireKeyActivatesAiming: true,
  aimInSameDirectionToFire: false,
  unmodifiedAiming: true,
  unmodifiedBuilding: true,
  backClearsAllReflector: true,
  keyboardShortcuts: {
    [ControlCode.Fire]: ["f", "shift f"],

    [ControlCode.Up]: ["w", "up"],
    [ControlCode.Down]: ["s", "down"],
    [ControlCode.Left]: ["a", "left"],
    [ControlCode.Right]: ["d", "right"],

    [ControlCode.Building1]: ["1"],
    [ControlCode.Building2]: ["2"],
    [ControlCode.Building3]: ["3"],
    [ControlCode.Building4]: ["4"],
    [ControlCode.Building5]: ["5"],
    [ControlCode.Building6]: ["6"],
    [ControlCode.Building7]: ["7"],
    [ControlCode.Building8]: ["8"],
    [ControlCode.Building9]: ["9"],
    [ControlCode.Building0]: ["0"],

    [ControlCode.QuickAction]: ["space"],
    [ControlCode.PlaceReflectorA]: ["e"],
    [ControlCode.PlaceReflectorB]: ["r"],
    [ControlCode.RotateReflector]: ["shift r"],
    [ControlCode.RemoveReflector]: ["t"],
    [ControlCode.RemoveBuilding]: ["x"],
    [ControlCode.ToggleJobs]: ["j"],
    [ControlCode.RotateBuilding]: ["r"],

    [ControlCode.Wait]: ["z"],
    [ControlCode.Back]: ["q", "esc"],
  },
};

export default defaultSettings;
