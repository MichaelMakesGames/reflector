import actions from "~/state/actions";
import { registerHandler } from "~state/handleAction";
import WrappedState from "~types/WrappedState";

function cancelPlacement(
  state: WrappedState,
  action: ReturnType<typeof actions.cancelPlacement>,
): void {
  state.act.removeEntities({
    entityIds: state.select
      .entityList()
      .filter(e => e.validMarker)
      .map(e => e.id),
  });
  const entity = state.select.placingTarget();
  const marker = state.select.placingMarker();
  if (!entity || !marker) return;
  state.act.removeEntities({ entityIds: [entity.id, marker.id] });
}

registerHandler(cancelPlacement, actions.cancelPlacement);
