import actions from "../actions";
import { registerHandler } from "~state/handleAction";
import WrappedState from "~types/WrappedState";
import { arePositionsEqual } from "~utils/geometry";

function cancelRemoveBuilding(
  state: WrappedState,
  action: ReturnType<typeof actions.executeRemoveBuilding>,
): void {
  const removingTarget = state.select
    .entitiesWithComps("pos", "building")
    .find((entity) => arePositionsEqual(entity.pos, action.payload));
  if (!removingTarget) return;
  if (removingTarget.housing && removingTarget.pos) {
    if (
      state.select
        .colonists()
        .some((colonist) => arePositionsEqual(colonist.pos, removingTarget.pos))
    ) {
      state.act.logMessage({
        message: "You cannot remove houses with colonists inside",
      });
      return;
    }
  }
  state.act.removeEntity(removingTarget.id);

  // remove job disabler
  state.select
    .entitiesAtPosition(action.payload)
    .filter((e) => e.jobDisabler)
    .forEach((e) => state.act.removeEntity(e.id));
}

registerHandler(cancelRemoveBuilding, actions.executeRemoveBuilding);
