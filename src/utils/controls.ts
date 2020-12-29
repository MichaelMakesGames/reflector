/* global navigator */
import { DOWN, LEFT, PLAYER_ID, RIGHT, UP } from "~constants";
import actions from "~state/actions";
import selectors from "~state/selectors";
import wrapState from "~state/wrapState";
import { Action, Pos, RawState } from "~types";
import { ControlCode } from "~types/ControlCode";
import { findValidPositions } from "./building";
import { areConditionsMet } from "./conditions";
import { createEntityFromTemplate } from "./entities";
import { arePositionsEqual, getPositionToDirection } from "./geometry";

export function getQuickAction(
  state: RawState,
  pos: Pos | null,
): null | { action: Action; label: string } {
  if (!pos) {
    return null;
  }

  const wrappedState = wrapState(state);
  const entitiesAtPos = wrappedState.select.entitiesAtPosition(pos);

  if (wrappedState.select.isPlacing()) {
    return {
      action: actions.finishPlacement({ placeAnother: true }),
      label: `Build ${
        createEntityFromTemplate(
          wrappedState.select.placingTarget()?.template || "NONE",
        ).description?.name
      }`,
    };
  }

  if (state.isAutoMoving) {
    return {
      action: actions.cancelAutoMove(),
      label: "Cancel Movement",
    };
  }

  if (
    wrappedState.select.entitiesWithComps("pathPreview", "pos").length &&
    !wrappedState.select.isWeaponActive()
  ) {
    return {
      action: actions.autoMove(),
      label: "Move Here",
    };
  }

  const reflectorAtPos = entitiesAtPos.find((e) => e.reflector);
  if (
    reflectorAtPos &&
    reflectorAtPos.reflector &&
    reflectorAtPos?.reflector.type === "\\"
  ) {
    return {
      action: actions.removeReflector(pos),
      label: "Remove Reflector",
    };
  } else if (reflectorAtPos) {
    return {
      action: actions.rotateEntity(reflectorAtPos),
      label: "Rotate Reflector",
    };
  }

  const player = selectors.player(state);
  const validPositions = player
    ? findValidPositions(
        wrappedState,
        [
          {
            pos: player.pos,
            range: player.projector ? player.projector.range : 0,
          },
          ...wrappedState.select
            .entitiesWithComps("projector", "pos")
            .filter((e) =>
              areConditionsMet(wrappedState, e, e.projector.condition),
            )
            .map((e) => ({
              pos: e.pos,
              range: e.projector.range,
            })),
        ],
        () => true, // selectors.canPlaceReflector,
        true,
      )
    : [];
  const canPlaceReflector = validPositions.some((validPos) =>
    arePositionsEqual(validPos, pos),
  );
  if (canPlaceReflector) {
    return {
      action: actions.addEntity(
        createEntityFromTemplate("REFLECTOR_UP_RIGHT", { pos }),
      ),
      label: "Place / Reflector",
    };
  }

  const jobDisablerAtPos = entitiesAtPos.find((e) => e.jobDisabler);
  if (jobDisablerAtPos) {
    return {
      action: actions.toggleDisabled(pos),
      label: "Enable Jobs",
    };
  }

  const jobProviderAtPos = entitiesAtPos.find((e) => e.jobProvider);
  if (jobProviderAtPos) {
    return {
      action: actions.toggleDisabled(pos),
      label: "Disable Jobs",
    };
  }

  if (player) {
    if (arePositionsEqual(pos, getPositionToDirection(player.pos, RIGHT))) {
      return {
        action: actions.move({ entityId: PLAYER_ID, ...RIGHT }),
        label: "Move",
      };
    }
    if (arePositionsEqual(pos, getPositionToDirection(player.pos, LEFT))) {
      return {
        action: actions.move({ entityId: PLAYER_ID, ...LEFT }),
        label: "Move",
      };
    }
    if (arePositionsEqual(pos, getPositionToDirection(player.pos, UP))) {
      return {
        action: actions.move({ entityId: PLAYER_ID, ...UP }),
        label: "Move",
      };
    }
    if (arePositionsEqual(pos, getPositionToDirection(player.pos, DOWN))) {
      return {
        action: actions.move({ entityId: PLAYER_ID, ...DOWN }),
        label: "Move",
      };
    }
  }

  return null;
}

export interface ActionControl {
  label: string;
  code: ControlCode;
  doNotRegisterShortcut?: boolean;
  action: Action;
}

export function getActionsAvailableAtPos(
  state: RawState,
  pos: Pos,
): ActionControl[] {
  if (selectors.isPlacing(state)) return [];
  const results: ActionControl[] = [];
  addReflectorActions(state, pos, results);
  addRemoveBuildingAction(state, pos, results);
  addDisableBuildingActions(state, pos, results);
  return results;
}

function addDisableBuildingActions(
  state: RawState,
  pos: Pos,
  results: ActionControl[],
) {
  const entitiesAtPos = selectors.entitiesAtPosition(state, pos);
  if (entitiesAtPos.some((e) => e.jobProvider)) {
    results.push({
      label: entitiesAtPos.some((e) => e.jobDisabler)
        ? "Enable Jobs"
        : "Disable Jobs",
      code: ControlCode.ToggleJobs,
      action: actions.toggleDisabled(pos),
    });
  }
}

function addRemoveBuildingAction(
  state: RawState,
  pos: Pos,
  results: ActionControl[],
) {
  const entitiesAtPos = selectors.entitiesAtPosition(state, pos);
  if (entitiesAtPos.some((e) => e.building)) {
    results.push({
      label: "Remove Building",
      code: ControlCode.RemoveBuilding,
      action: actions.executeRemoveBuilding(pos),
    });
  }
}

function addReflectorActions(
  state: RawState,
  pos: Pos,
  results: ActionControl[],
) {
  const wrappedState = wrapState(state);
  const player = selectors.player(state);
  if (!player) return;
  const validPositions = findValidPositions(
    wrappedState,
    [
      {
        pos: player.pos,
        range: player.projector ? player.projector.range : 0,
      },
      ...wrappedState.select
        .entitiesWithComps("projector", "pos")
        .filter((e) => areConditionsMet(wrappedState, e, e.projector.condition))
        .map((e) => ({
          pos: e.pos,
          range: e.projector.range,
        })),
    ],
    () => true, // selectors.canPlaceReflector,
    true,
  );
  if (validPositions.some((validPos) => arePositionsEqual(pos, validPos))) {
    const reflectorAtPos = wrappedState.select
      .entitiesAtPosition(pos)
      .find((e) => e.reflector);
    results.push(
      {
        label: "Place / Reflector",
        code: ControlCode.PlaceReflectorA,
        action: reflectorAtPos
          ? actions.rotateEntity(reflectorAtPos)
          : actions.addEntity(
              createEntityFromTemplate("REFLECTOR_UP_RIGHT", { pos }),
            ),
      },
      {
        label: "Place \\ Reflector",
        code: ControlCode.PlaceReflectorB,
        action: reflectorAtPos
          ? actions.rotateEntity(reflectorAtPos)
          : actions.addEntity(
              createEntityFromTemplate("REFLECTOR_DOWN_RIGHT", { pos }),
            ),
      },
    );
  }

  const entitiesAtPos = wrappedState.select.entitiesAtPosition(pos);
  const reflectorAtPos = entitiesAtPos.find((e) => e.reflector);
  if (reflectorAtPos) {
    results.push({
      label: "Remove Reflector",
      code: ControlCode.RemoveReflector,
      action: actions.removeReflector(pos),
    });
  }
}

export function isMac() {
  return navigator.platform.toUpperCase().includes("MAC");
}

export function noFocusOnClick(
  callback: (e: React.MouseEvent) => void,
): (e: React.MouseEvent) => void {
  return (e: React.MouseEvent) => {
    const target = e.nativeEvent.target as HTMLElement | null;
    if (target && target.blur) target.blur();
    callback(e);
  };
}
