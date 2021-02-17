import { createStandardAction } from "typesafe-actions";
import { registerHandler } from "~state/handleAction";
import WrappedState from "~types/WrappedState";

const blueprintCancel = createStandardAction("BLUEPRINT_CANCEL")();
export default blueprintCancel;

function blueprintCancelHandler(
  state: WrappedState,
  action: ReturnType<typeof blueprintCancel>,
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

registerHandler(blueprintCancelHandler, blueprintCancel);
