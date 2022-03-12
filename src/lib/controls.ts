/* global navigator */
import resources from "../data/resources";
import renderer from "../renderer";
import actions from "../state/actions";
import selectors from "../state/selectors";
import wrapState from "../state/wrapState";
import { Action, Pos, RawState, Rebuildable } from "../types";
import { ControlCode } from "../types/ControlCode";
import { canPlaceReflector } from "./building";
import { createEntityFromTemplate } from "./entities";
import { isPositionInMap } from "./geometry";

export function getQuickAction(
  state: RawState,
  pos: Pos | null,
  modified?: boolean
): null | { action: Action; label: string; cursor: string } {
  if (!pos) {
    return null;
  }

  const wrappedState = wrapState(state);
  const entitiesAtPos = wrappedState.select.entitiesAtPosition(pos);

  if (wrappedState.select.hasActiveBlueprint()) {
    const blueprint = wrappedState.select.blueprint();
    const entityToPlace = createEntityFromTemplate(
      blueprint ? blueprint.template : "NONE"
    );
    return {
      action: actions.blueprintBuild({ buildAnother: modified }),
      cursor: "build",
      label: `Build ${
        entityToPlace.description ? entityToPlace.description.name : ""
      }`,
    };
  }

  if (state.isAutoMoving) {
    return {
      action: actions.cancelAutoMove(),
      cursor: "cancel",
      label: "Cancel Movement",
    };
  }

  const reflectorAtPos = entitiesAtPos.find((e) => e.reflector);
  if (
    reflectorAtPos &&
    reflectorAtPos.reflector &&
    reflectorAtPos.reflector.type === "\\"
  ) {
    return {
      action: actions.removeReflector(pos),
      cursor: "reflector",
      label: "Remove Reflector",
    };
  } else if (reflectorAtPos) {
    return {
      action: actions.rotateEntity(reflectorAtPos),
      cursor: "reflector",
      label: "Rotate Reflector",
    };
  }

  if (
    canPlaceReflector(wrappedState, pos) &&
    entitiesAtPos.some((e) => e.laser)
  ) {
    return {
      action: actions.addEntity(
        createEntityFromTemplate("REFLECTOR_UP_RIGHT", { pos })
      ),
      cursor: "reflector",
      label: "Place / Reflector",
    };
  }

  const rubble = entitiesAtPos.find((e) => e.rebuildable);
  if (rubble) {
    const blueprint = createEntityFromTemplate(
      (rubble.rebuildable as Rebuildable).blueprint
    );
    const cost = blueprint?.blueprint?.cost;
    return {
      action: actions.rebuild(rubble.id),
      cursor: "build",
      label: `Rebuild${
        cost ? ` (${cost.amount} ${resources[cost.resource].label})` : ""
      }`,
    };
  }

  if (
    wrappedState.select.entitiesWithComps("pathPreview", "pos").length &&
    !wrappedState.select.isWeaponActive()
  ) {
    return {
      action: actions.autoMove(),
      cursor: "move",
      label: "Move Here",
    };
  }

  if (
    wrappedState.select.isWeaponActive() &&
    canPlaceReflector(wrappedState, pos)
  ) {
    return {
      action: actions.addEntity(
        createEntityFromTemplate("REFLECTOR_UP_RIGHT", { pos })
      ),
      cursor: "reflector",
      label: "Place / Reflector",
    };
  }

  return null;
}

export interface ActionControl {
  label: string;
  code: ControlCode;
  doNotRegisterShortcut?: boolean;
  action?: Action;
  callback?: () => void;
}

export function getActionsAvailableAtPos(
  state: RawState,
  pos: Pos
): ActionControl[] {
  if (selectors.hasActiveBlueprint(state)) return [];
  const results: ActionControl[] = [];
  addRebuildAction(state, pos, results);
  addReflectorActions(state, pos, results);
  addRemoveBuildingAction(state, pos, results);
  addDisableBuildingActions(state, pos, results);
  addCenterViewAction(state, pos, results);
  return results;
}

function addCenterViewAction(
  state: RawState,
  pos: Pos,
  results: ActionControl[]
) {
  if (isPositionInMap(pos)) {
    results.push({
      label: `Center View`,
      code: ControlCode.Center,
      callback: () => renderer.center(pos),
    });
  }
}

function addRebuildAction(state: RawState, pos: Pos, results: ActionControl[]) {
  const entitiesAtPos = selectors.entitiesAtPosition(state, pos);
  const rubble = entitiesAtPos.find((e) => e.rebuildable);
  if (rubble) {
    const blueprint = createEntityFromTemplate(
      (rubble.rebuildable as Rebuildable).blueprint
    );
    const cost = blueprint?.blueprint?.cost;
    results.push({
      label: `Rebuild${
        cost ? ` (${cost.amount} ${resources[cost.resource].label})` : ""
      }`,
      code: ControlCode.Rebuild,
      action: actions.rebuild(rubble.id),
    });
  }
}

function addDisableBuildingActions(
  state: RawState,
  pos: Pos,
  results: ActionControl[]
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
  results: ActionControl[]
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
  results: ActionControl[]
) {
  const wrappedState = wrapState(state);
  const player = selectors.player(state);
  if (!player) return;
  if (canPlaceReflector(wrappedState, pos)) {
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
              createEntityFromTemplate("REFLECTOR_UP_RIGHT", { pos })
            ),
      },
      {
        label: "Place \\ Reflector",
        code: ControlCode.PlaceReflectorB,
        action: reflectorAtPos
          ? actions.rotateEntity(reflectorAtPos)
          : actions.addEntity(
              createEntityFromTemplate("REFLECTOR_DOWN_RIGHT", { pos })
            ),
      }
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
  callback: (e: React.MouseEvent) => void
): (e: React.MouseEvent) => void {
  return (e: React.MouseEvent) => {
    const target = e.currentTarget as HTMLElement | null;
    if (target && target.blur) target.blur();
    callback(e);
  };
}
