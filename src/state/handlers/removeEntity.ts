import { removeRenderEntity } from "~/renderer";
import actions from "~/state/actions";
import selectors from "~/state/selectors";
import { getPosKey } from "~/utils/geometry";
import { registerHandler } from "~state/handleAction";
import WrappedState from "~types/WrappedState";

function removeEntity(
  wrappedState: WrappedState,
  action: ReturnType<typeof actions.removeEntity>,
): void {
  const { raw: state } = wrappedState;
  const entityId = action.payload;
  const prev = selectors.entityById(state, entityId);
  if (!prev) {
    console.warn(`tried to remove nonexistant entity ${entityId}`);
    return;
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
  delete entities[entityId];
  wrappedState.setRaw({
    ...state,
    entitiesByPosition,
    entities,
  });
}

registerHandler(removeEntity, actions.removeEntity);
