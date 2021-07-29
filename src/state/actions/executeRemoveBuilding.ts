import { createStandardAction } from "typesafe-actions";
import { registerHandler } from "~state/handleAction";
import { Pos } from "~types";
import WrappedState from "~types/WrappedState";
import { arePositionsEqual } from "~lib/geometry";

const executeRemoveBuilding = createStandardAction("EXECUTE_REMOVE_BUILDING")<
  Pos
>();
export default executeRemoveBuilding;

function executeRemoveBuildingHandler(
  state: WrappedState,
  action: ReturnType<typeof executeRemoveBuilding>,
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
  if (
    removingTarget.temperature &&
    removingTarget.temperature.status !== "normal"
  ) {
    state.act.logMessage({
      message: "You cannot remove overheating buildings",
    });
    return;
  }
  state.act.removeEntity(removingTarget.id);

  // remove job disabler
  state.select
    .entitiesAtPosition(action.payload)
    .filter((e) => e.jobDisabler)
    .forEach((e) => state.act.removeEntity(e.id));
}

registerHandler(executeRemoveBuildingHandler, executeRemoveBuilding);
