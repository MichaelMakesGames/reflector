import { createAction } from "typesafe-actions";
import { registerHandler } from "../handleAction";
import WrappedState from "../../types/WrappedState";
import { executeEffect } from "../../data/effects";

const temperatureDecrease = createAction("temperatureDecrease")<string>();
export default temperatureDecrease;

function temperatureDecreaseHandler(
  state: WrappedState,
  action: ReturnType<typeof temperatureDecrease>
): void {
  const entity = state.select.entityById(action.payload);
  if (!entity || !entity.temperature) return;
  const { status } = entity.temperature;
  if (status === "hot") {
    state.act.updateEntity({
      id: entity.id,
      temperature: { ...entity.temperature, status: "normal" },
    });
    executeEffect("CLEAR_UI_OVERHEATING_HOT", state, undefined, entity);
  } else if (status === "very hot") {
    state.act.updateEntity({
      id: entity.id,
      temperature: { ...entity.temperature, status: "hot" },
    });
    executeEffect("CLEAR_UI_OVERHEATING_VERY_HOT", state, undefined, entity);
    executeEffect("SPAWN_UI_OVERHEATING_HOT", state, undefined, entity);
  } else if (status === "critical") {
    state.act.updateEntity({
      id: entity.id,
      temperature: { ...entity.temperature, status: "very hot" },
    });
    executeEffect("CLEAR_UI_OVERHEATING_CRITICAL", state, undefined, entity);
    executeEffect("SPAWN_UI_OVERHEATING_VERY_HOT", state, undefined, entity);
  }
}

registerHandler(temperatureDecreaseHandler, temperatureDecrease);
