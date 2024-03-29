import { createAction } from "typesafe-actions";
import { registerHandler } from "../handleAction";
import { Pos } from "../../types";
import WrappedState from "../../types/WrappedState";
import { createEntityFromTemplate } from "../../lib/entities";
import { arePositionsEqual } from "../../lib/geometry";

const toggleDisabled = createAction("TOGGLE_DISABLED")<Pos>();
export default toggleDisabled;

function toggleDisabledHandler(
  state: WrappedState,
  action: ReturnType<typeof toggleDisabled>
): void {
  const pos = action.payload;
  const disablers = state.select.jobDisablers();
  const disablerAtPos = disablers.find((e) => arePositionsEqual(e.pos, pos));
  if (disablerAtPos) {
    state.act.removeEntity(disablerAtPos.id);
  } else if (state.select.entitiesAtPosition(pos).some((e) => e.jobProvider)) {
    state.act.addEntity(createEntityFromTemplate("UI_JOB_DISABLER", { pos }));
  }
}

registerHandler(toggleDisabledHandler, toggleDisabled);
