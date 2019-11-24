import actions from "~/state/actions";
import { MakeRequired, Entity } from "~/types";
import { getPosKey } from "~/utils/geometry";
import { addRenderEntity } from "~/renderer";
import { registerHandler } from "~state/handleAction";
import WrappedState from "~types/WrappedState";

function addEntity(
  wrappedState: WrappedState,
  action: ReturnType<typeof actions.addEntity>,
): void {
  let state = wrappedState.raw;
  const { entity } = action.payload;
  let { entitiesByPosition } = state;
  if (entity.pos) {
    const key = getPosKey(entity.pos);
    entitiesByPosition = {
      ...entitiesByPosition,
      [key]: [...(entitiesByPosition[key] || []), entity.id],
    };
  }

  if (entity.pos && entity.display) {
    addRenderEntity(entity as MakeRequired<Entity, "pos" | "display">);
  }

  state = {
    ...state,
    entitiesByPosition,
    entities: {
      ...state.entities,
      [entity.id]: entity,
    },
  };

  wrappedState.setRaw(state);
}

registerHandler(addEntity, actions.addEntity);
