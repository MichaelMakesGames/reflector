import actions from "~state/actions";
import { registerHandler } from "~state/handleAction";
import WrappedState from "~types/WrappedState";
import { arePositionsEqual } from "~utils/geometry";
import { createEntityFromTemplate } from "~utils/entities";

function toggleDisabled(
  state: WrappedState,
  action: ReturnType<typeof actions.toggleDisabled>,
): void {
  const pos = action.payload;
  const disablers = state.select.jobDisablers();
  const disablerAtPos = disablers.find((e) => arePositionsEqual(e.pos, pos));
  if (disablerAtPos) {
    state.act.removeEntity(disablerAtPos.id);
  } else if (state.select.entitiesAtPosition(pos).some((e) => e.jobProvider)) {
    state.act.addEntity(createEntityFromTemplate("JOB_DISABLER", { pos }));
  }
}

registerHandler(toggleDisabled, actions.toggleDisabled);
