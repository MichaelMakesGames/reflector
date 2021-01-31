import actions from "~/state/actions";
import { registerHandler } from "~state/handleAction";
import WrappedState from "~types/WrappedState";

function blueprintCancel(
  state: WrappedState,
  action: ReturnType<typeof actions.blueprintCancel>,
): void {
  state.act.removeEntities(
    state.select
      .entityList()
      .filter((e) => e.validMarker)
      .map((e) => e.id),
  );
  const entity = state.select.blueprint();
  if (!entity) return;
  state.act.removeEntities([entity.id]);
}

registerHandler(blueprintCancel, actions.blueprintCancel);
