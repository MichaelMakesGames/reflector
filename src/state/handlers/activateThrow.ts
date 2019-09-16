import * as actions from "../actions";
import { THROWING_RANGE } from "../../constants";
import { computeThrowFOV } from "../../utils/fov";
import { createEntityFromTemplate } from "../../utils/entities";
import * as selectors from "../selectors";

import { GameState } from "../../types";
import { addEntity } from "./addEntity";

export function activateThrow(
  state: GameState,
  action: ReturnType<typeof actions.activateThrow>,
): GameState {
  let newState = state;
  const player = selectors.player(newState);
  if (!player) return newState;
  if (action.payload.entity.reflector && !player.inventory.reflectors) {
    return newState;
  }
  if (action.payload.entity.splitter && !player.inventory.splitters) {
    return newState;
  }

  const fovPositions = computeThrowFOV(newState, player.pos, THROWING_RANGE);
  for (const pos of fovPositions) {
    newState = addEntity(
      newState,
      actions.addEntity({
        entity: createEntityFromTemplate("FOV_MARKER", { pos }),
      }),
    );
  }

  const { entity } = action.payload;
  entity.throwing = { range: THROWING_RANGE };
  newState = addEntity(newState, actions.addEntity({ entity }));
  return newState;
}
