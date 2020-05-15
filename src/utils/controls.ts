import { RawState, Pos, Action } from "~types";
import selectors from "~state/selectors";
import actions from "~state/actions";
import { PLAYER_ID } from "~constants";
import wrapState from "~state/wrapState";
import { findValidPositions } from "./building";
import { areConditionsMet } from "./conditions";
import { arePositionsEqual } from "./geometry";
import { createEntityFromTemplate } from "./entities";

type Results = { label: string; action: Action }[];

export function getActionsAvailableAtPos(state: RawState, pos: Pos): Results {
  const results: Results = [];
  addReflectorActions(state, pos, results);
  addRemoveBuildingAction(state, pos, results);
  addDisableBuildingActions(state, pos, results);
  addMoveAction(state, pos, results);
  results.push({ label: "Make Me Rich", action: actions.makeMeRich() });
  return results;
}

function addMoveAction(state: RawState, pos: Pos, results: Results) {
  const player = selectors.player(state);
  if (player) {
    const playerPos = player.pos;
    if (Math.abs(playerPos.x - pos.x) + Math.abs(playerPos.y - pos.y) === 1) {
      results.push({
        label: "Move",
        action: actions.move({
          entityId: PLAYER_ID,
          dx: pos.x - playerPos.x,
          dy: pos.y - playerPos.y,
        }),
      });
    }
  }
}

function addDisableBuildingActions(
  state: RawState,
  pos: Pos,
  results: Results,
) {
  const entitiesAtPos = selectors.entitiesAtPosition(state, pos);
  if (entitiesAtPos.some((e) => e.building)) {
    results.push({
      label: entitiesAtPos.some((e) => e.jobDisabler)
        ? "Enable Jobs"
        : "Disable Jobs",
      action: actions.toggleDisabled(pos),
    });
  }
}

function addRemoveBuildingAction(state: RawState, pos: Pos, results: Results) {
  const entitiesAtPos = selectors.entitiesAtPosition(state, pos);
  if (entitiesAtPos.some((e) => e.building)) {
    results.push({
      label: "Remove Building",
      action: actions.executeRemoveBuilding(pos),
    });
  }
}

function addReflectorActions(state: RawState, pos: Pos, results: Results) {
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
    selectors.canPlaceReflector,
    true,
  );
  if (validPositions.some((validPos) => arePositionsEqual(pos, validPos))) {
    results.push({
      label: "Place Reflector",
      action: actions.addEntity(
        createEntityFromTemplate("REFLECTOR_UP_RIGHT", { pos }),
      ),
    });
  }

  const entitiesAtPos = wrappedState.select.entitiesAtPosition(pos);
  const reflectorAtPos = entitiesAtPos.find((e) => e.reflector);
  if (reflectorAtPos) {
    results.push({
      label: "Rotate Reflector",
      action: actions.rotateEntity(reflectorAtPos),
    });
    results.push({
      label: "Remove Reflector",
      action: actions.removeEntity(reflectorAtPos.id),
    });
  }
}
