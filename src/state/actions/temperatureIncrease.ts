import { createAction } from "typesafe-actions";
import { executeEffect } from "../../data/effects";
import WrappedState from "../../types/WrappedState";
import { registerHandler } from "../handleAction";

const temperatureIncrease = createAction("temperatureIncrease")<string>();
export default temperatureIncrease;

function temperatureIncreaseHandler(
  state: WrappedState,
  action: ReturnType<typeof temperatureIncrease>
): void {
  const entity = state.select.entityById(action.payload);
  if (!entity || !entity.temperature) return;
  const { status } = entity.temperature;
  if (status === "normal") {
    state.act.updateEntity({
      id: entity.id,
      temperature: { ...entity.temperature, status: "hot" },
    });
    executeEffect("SPAWN_UI_OVERHEATING_HOT", state, undefined, entity);
  } else if (status === "hot") {
    state.act.updateEntity({
      id: entity.id,
      temperature: { ...entity.temperature, status: "very hot" },
    });
    executeEffect("SPAWN_UI_OVERHEATING_VERY_HOT", state, undefined, entity);
    executeEffect("CLEAR_UI_OVERHEATING_HOT", state, undefined, entity);
  } else if (status === "very hot") {
    state.act.updateEntity({
      id: entity.id,
      temperature: { ...entity.temperature, status: "critical" },
    });
    executeEffect("SPAWN_UI_OVERHEATING_CRITICAL", state, undefined, entity);
    executeEffect("CLEAR_UI_OVERHEATING_VERY_HOT", state, undefined, entity);
  } else if (status === "critical") {
    executeEffect(entity.temperature.onOverheat, state, undefined, entity);
  }
}

registerHandler(temperatureIncreaseHandler, temperatureIncrease);
