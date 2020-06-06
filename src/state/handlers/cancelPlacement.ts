import actions from "~/state/actions";
import { registerHandler } from "~state/handleAction";
import WrappedState from "~types/WrappedState";

function cancelPlacement(
  state: WrappedState,
  action: ReturnType<typeof actions.cancelPlacement>,
): void {
  state.act.removeEntities(
    state.select
      .entityList()
      .filter((e) => e.validMarker)
      .map((e) => e.id),
  );
  const entity = state.select.placingTarget();
  if (!entity) return;
  state.act.removeEntities([entity.id]);
}

registerHandler(cancelPlacement, actions.cancelPlacement);
