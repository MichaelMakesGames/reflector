import * as actions from "~/state/actions";
import * as selectors from "~/state/selectors";
import { GameState } from "~/types";
import { getPosKey } from "~/utils/geometry";
import { removeRenderEntity } from "~/renderer";
import { registerHandler } from "~state/handleAction";

function removeEntity(
  state: GameState,
  action: ReturnType<typeof actions.removeEntity>,
): GameState {
  const prev = selectors.entityById(state, action.payload.entityId);
  if (!prev) {
    console.warn(
      `tried to remove nonexistant entity ${action.payload.entityId}`,
    );
    return state;
  }
  let { entitiesByPosition } = state;
  if (prev.pos) {
    const key = getPosKey(prev.pos);
    entitiesByPosition = {
      ...entitiesByPosition,
      [key]: entitiesByPosition[key].filter(id => id !== prev.id),
    };
  }

  if (prev.pos && prev.display) {
    removeRenderEntity(prev.id);
  }

  const entities = { ...state.entities };
  delete entities[action.payload.entityId];
  return {
    ...state,
    entitiesByPosition,
    entities,
  };
}

registerHandler(removeEntity, actions.removeEntity);
