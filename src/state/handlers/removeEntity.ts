import { removeRenderEntity, removeSmoke } from "~/renderer";
import actions from "~/state/actions";
import selectors from "~/state/selectors";
import { getPosKey } from "~/utils/geometry";
import { registerHandler } from "~state/handleAction";
import WrappedState from "~types/WrappedState";
import { Pos } from "~types";
import { retargetLaserOnReflectorChange } from "~utils/lasers";

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
      [key]: entitiesByPosition[key].filter((id) => id !== prev.id),
    };
  }

  if (prev.pos && prev.display) {
    removeRenderEntity(prev.id);
  }

  if (prev.smokeEmitter && prev.pos) {
    prev.smokeEmitter.emitters.forEach((emitter) =>
      removeSmoke(prev.pos as Pos, emitter.offset),
    );
  }

  const entities = { ...state.entities };
  delete entities[entityId];
  wrappedState.setRaw({
    ...state,
    entitiesByPosition,
    entities,
  });

  if (prev.pos && prev.reflector) {
    retargetLaserOnReflectorChange(wrappedState, prev.pos);
  }
}

registerHandler(removeEntity, actions.removeEntity);
