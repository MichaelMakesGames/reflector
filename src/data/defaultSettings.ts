import Settings from "~types/Settings";
import { ControlCode } from "../types/ControlCode";

const defaultSettings: Settings = {
  aimingModifierKey: "shift",
  cursorModifierKey: "alt",
  fireKeyActivatesAiming: true,
  aimInSameDirectionToFire: false,
  unmodifiedAiming: true,
  unmodifiedBuilding: false,
  keyboardShortcuts: {
    [ControlCode.Fire]: ["f", "shift+f"],

    [ControlCode.Up]: ["w", "up"],
    [ControlCode.Down]: ["s", "down"],
    [ControlCode.Left]: ["a", "left"],
    [ControlCode.Right]: ["d", "right"],

    [ControlCode.Menu]: ["F10"],
    [ControlCode.Menu1]: ["1"],
    [ControlCode.Menu2]: ["2"],
    [ControlCode.Menu3]: ["3"],
    [ControlCode.Menu4]: ["4"],
    [ControlCode.Menu5]: ["5"],
    [ControlCode.Menu6]: ["6"],
    [ControlCode.Menu7]: ["7"],
    [ControlCode.Menu8]: ["8"],
    [ControlCode.Menu9]: ["9"],
    [ControlCode.Menu0]: ["0"],
    [ControlCode.RotateBuilding]: ["r"],

    [ControlCode.QuickAction]: ["space"],
    [ControlCode.PlaceReflectorA]: ["e"],
    [ControlCode.PlaceReflectorB]: ["r"],
    [ControlCode.RotateReflector]: ["shift+r"],
    [ControlCode.RemoveReflector]: ["t"],
    [ControlCode.ClearAllReflectors]: ["c"],
    [ControlCode.RemoveBuilding]: ["x"],
    [ControlCode.ToggleJobs]: ["j"],

    [ControlCode.Wait]: ["z"],
    [ControlCode.Back]: ["q", "esc"],
    [ControlCode.Undo]: ["ctrl+z"],
    [ControlCode.Help]: ["?"],
    [ControlCode.ZoomIn]: ["+", "="],
    [ControlCode.ZoomOut]: ["-", "_"],
    [ControlCode.JobPriorities]: ["v"],
  },
};

export default defaultSettings;
