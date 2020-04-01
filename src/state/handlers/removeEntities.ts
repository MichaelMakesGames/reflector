import { removeRenderEntity } from "~/renderer";
import actions from "~/state/actions";
import { registerHandler } from "~state/handleAction";
import WrappedState from "~types/WrappedState";

function removeEntities(
  wrappedState: WrappedState,
  action: ReturnType<typeof actions.removeEntities>,
): void {
  const { raw: state } = wrappedState;
  const { entitiesByPosition } = state;
  const entityIds = action.payload;
  for (const [key, ids] of Object.entries(entitiesByPosition)) {
    entitiesByPosition[key] = ids.filter((id) => !entityIds.includes(id));
  }
  const entities = {
    ...state.entities,
  };
  for (const id of entityIds) {
    if (entities[id].pos && entities[id].display) {
      removeRenderEntity(id);
    }
    delete entities[id];
  }
  wrappedState.setRaw({
    ...state,
    entitiesByPosition: { ...entitiesByPosition },
    entities,
  });
}

registerHandler(removeEntities, actions.removeEntities);
