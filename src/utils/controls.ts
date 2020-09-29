/* global document, navigator */
import { DOWN, LEFT, PLAYER_ID, UP } from "~constants";
import { ControlCode } from "~types/ControlCode";
import actions from "~state/actions";
import selectors from "~state/selectors";
import wrapState from "~state/wrapState";
import { Action, Pos, RawState } from "~types";
import { findValidPositions } from "./building";
import { areConditionsMet } from "./conditions";
import { createEntityFromTemplate } from "./entities";
import { areDirectionsEqual, arePositionsEqual } from "./geometry";

export interface ActionControl {
  label: string;
  controlCode: ControlCode;
  doNotRegisterShortcut?: boolean;
  action: Action | Action[];
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
  addMoveAction(state, pos, results);
  return results;
}

function addMoveAction(state: RawState, pos: Pos, results: ActionControl[]) {
  const player = selectors.player(state);
  if (player) {
    const playerPos = player.pos;
    if (
      Math.abs(playerPos.x - pos.x) + Math.abs(playerPos.y - pos.y) === 1 &&
      !selectors.isPositionBlocked(state, pos)
    ) {
      const dir = { dx: pos.x - playerPos.x, dy: pos.y - playerPos.y };
      let controlCode: ControlCode;
      if (areDirectionsEqual(dir, UP)) {
        controlCode = ControlCode.Up;
      } else if (areDirectionsEqual(dir, DOWN)) {
        controlCode = ControlCode.Down;
      } else if (areDirectionsEqual(dir, LEFT)) {
        controlCode = ControlCode.Left;
      } else {
        // if (areDirectionsEqual(dir, RIGHT))
        controlCode = ControlCode.Right;
      }
      results.push({
        label: "Move",
        controlCode,
        doNotRegisterShortcut: true,
        action: actions.move({
          entityId: PLAYER_ID,
          ...dir,
        }),
      });
    }
  }
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
      controlCode: ControlCode.ToggleJobs,
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
      controlCode: ControlCode.RemoveBuilding,
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
    results.push(
      {
        label: "Place \\ Reflector",
        controlCode: ControlCode.PlaceReflectorA,
        action: [
          actions.removeReflector(pos),
          actions.addEntity(
            createEntityFromTemplate("REFLECTOR_DOWN_RIGHT", { pos }),
          ),
        ],
      },
      {
        label: "Place / Reflector",
        controlCode: ControlCode.PlaceReflectorB,
        action: [
          actions.removeReflector(pos),
          actions.addEntity(
            createEntityFromTemplate("REFLECTOR_UP_RIGHT", { pos }),
          ),
        ],
      },
    );
  }

  const entitiesAtPos = wrappedState.select.entitiesAtPosition(pos);
  const reflectorAtPos = entitiesAtPos.find((e) => e.reflector);
  if (reflectorAtPos) {
    // results.push({
    //   label: "Rotate Reflector",
    //   controlCode: ControlCode.RotateReflector,
    //   action: actions.rotateEntity(reflectorAtPos),
    // });
    results.push({
      label: "Remove Reflector",
      controlCode: ControlCode.RemoveReflector,
      action: actions.removeReflector(pos),
    });
  }

  results.push({
    label: "Clear All Reflectors",
    controlCode: ControlCode.ClearAllReflectors,
    action: actions.clearReflectors(),
  });
}

export function isDndFocused() {
  if (document.activeElement) {
    const activeElement = document.activeElement as HTMLElement;
    return Boolean(activeElement.dataset.jobsDndIndex);
  }
  return false;
}

export function isMac() {
  return navigator.platform.toUpperCase().includes("MAC");
}
