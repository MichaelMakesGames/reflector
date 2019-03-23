import * as actions from "../actions";
import { THROWING_RANGE } from "../../constants";
import { computeThrowFOV } from "../../utils";
import * as selectors from "../selectors";
import { createEntityFromTemplate } from "../../utils";
import { GameState } from "../../types";
import { addEntity } from "./addEntity";

export function activateThrow(
  state: GameState,
  action: ReturnType<typeof actions.activateThrow>,
): GameState {
  const player = selectors.player(state);
  if (!player) return state;
  if (action.payload.entity.reflector && !player.inventory.reflectors) {
    return state;
  }
  if (action.payload.entity.splitter && !player.inventory.splitters) {
    return state;
  }

  const fovPositions = computeThrowFOV(state, player.pos, THROWING_RANGE);
  for (let pos of fovPositions) {
    state = addEntity(
      state,
      actions.addEntity({
        entity: createEntityFromTemplate("FOV_MARKER", { pos: pos }),
      }),
    );
  }

  const { entity } = action.payload;
  entity.throwing = { range: THROWING_RANGE };
  state = addEntity(state, actions.addEntity({ entity }));
  return state;
}
