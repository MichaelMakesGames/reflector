import * as actions from "../actions";
import { THROWING_RANGE } from "../constants";
import { computeThrowFOV } from "../fov";
import * as selectors from "../selectors";
import { createEntityFromTemplate } from "../templates";
import { GameState } from "../types";
import { addEntity } from "./addEntity";

export function activateThrow(
  state: GameState,
  action: ReturnType<typeof actions.activateThrow>,
): GameState {
  const player = selectors.player(state);
  if (!player || !player.position || !player.inventory) return state;
  if (action.payload.entity.reflector && !player.inventory.reflectors) {
    return state;
  }
  if (action.payload.entity.splitter && !player.inventory.splitters) {
    return state;
  }

  const fovPositions = computeThrowFOV(state, player.position, THROWING_RANGE);
  for (let pos of fovPositions) {
    state = addEntity(
      state,
      actions.addEntity({
        entity: createEntityFromTemplate("FOV_MARKER", { position: pos }),
      }),
    );
  }

  const { entity } = action.payload;
  entity.throwing = { range: THROWING_RANGE };
  state = addEntity(state, actions.addEntity({ entity }));
  return state;
}
