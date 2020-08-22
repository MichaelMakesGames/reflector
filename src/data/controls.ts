export enum ControlCode {
  AimUp = "AIM_UP",
  AimDown = "AIM_DOWN",
  AimLeft = "AIM_LEFT",
  AimRight = "AIM_RIGHT",

  Fire = "FIRE",

  PlayerUp = "PLAYER_UP",
  PlayerDown = "PLAYER_DOWN",
  PlayerLeft = "PLAYER_LEFT",
  PlayerRight = "PLAYER_RIGHT",

  CursorUp = "CURSOR_UP",
  CursorDown = "CURSOR_DOWN",
  CursorLeft = "CURSOR_LEFT",
  CursorRight = "CURSOR_RIGHT",

  Building1 = "BUILDING_1",
  Building2 = "BUILDING_2",
  Building3 = "BUILDING_3",
  Building4 = "BUILDING_4",
  Building5 = "BUILDING_5",
  Building6 = "BUILDING_6",
  Building7 = "BUILDING_7",
  Building8 = "BUILDING_8",
  Building9 = "BUILDING_9",
  Building0 = "BUILDING_0",

  PlaceReflectorA = "PLACE_REFLECTOR_A",
  PlaceReflectorB = "PLACE_REFLECTOR_B",
  RotateReflector = "ROTATE_REFLECTOR",
  RemoveReflector = "REMOVE_REFLECTOR",

  RemoveBuilding = "REMOVE_BUILDING",
  RotateBuilding = "ROTATE_BUILDING",
  ToggleJobs = "TOGGLE_JOBS",
  Wait = "WAIT",
  QuickAction = "QUICK_ACTION",
  Back = "BACK",
}

const controls: Record<ControlCode, string[]> = {
  [ControlCode.AimUp]: ["shift w", "shift up"],
  [ControlCode.AimDown]: ["shift s", "shift down"],
  [ControlCode.AimLeft]: ["shift a", "shift left"],
  [ControlCode.AimRight]: ["shift d", "shift right"],

  [ControlCode.Fire]: ["enter", "shift enter"],

  [ControlCode.PlayerUp]: ["w", "up"],
  [ControlCode.PlayerDown]: ["s", "down"],
  [ControlCode.PlayerLeft]: ["a", "left"],
  [ControlCode.PlayerRight]: ["d", "right"],

  [ControlCode.CursorUp]: ["alt w", "alt up"],
  [ControlCode.CursorDown]: ["alt s", "alt down"],
  [ControlCode.CursorLeft]: ["alt a", "alt left"],
  [ControlCode.CursorRight]: ["alt d", "alt right"],

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
};

export default controls;
