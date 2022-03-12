import Settings from "../types/Settings";
import { ControlCode } from "../types/ControlCode";

const defaultSettings: Settings = {
  cursorModifierKey: "shift",
  fireKeyActivatesAiming: true,
  aimInSameDirectionToFire: false,
  unmodifiedAiming: true,
  unmodifiedBuilding: false,
  musicVolume: 50,
  sfxVolume: 50,
  clickToMove: "ADJACENT",
  keybindings: {
    [ControlCode.Fire]: ["f"],

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
    [ControlCode.PlaceReflectorA]: ["/"],
    [ControlCode.PlaceReflectorB]: ["\\"],
    [ControlCode.RemoveReflector]: ["x"],
    [ControlCode.ClearAllReflectors]: ["e"],
    [ControlCode.RemoveBuilding]: ["backspace"],
    [ControlCode.Rebuild]: ["r"],
    [ControlCode.ToggleJobs]: ["j"],

    [ControlCode.Wait]: ["z"],
    [ControlCode.Back]: ["q", "esc"],
    [ControlCode.Undo]: ["ctrl+z"],
    [ControlCode.Help]: ["?"],
    [ControlCode.ZoomIn]: ["+", "="],
    [ControlCode.ZoomOut]: ["-", "_"],
    [ControlCode.Center]: ["c"],
    [ControlCode.Recenter]: ["h"],
    [ControlCode.FocusJobPriorities]: ["p"],
    [ControlCode.DismissNotifications]: ["`"],

    [ControlCode.FocusTutorials]: ["t"],
    [ControlCode.ToggleTutorials]: ["shift+t"],
    [ControlCode.DismissTutorial]: ["backspace"],
  },
};

export default defaultSettings;
