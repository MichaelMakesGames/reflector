import { createAction } from "typesafe-actions";
import { registerHandler } from "../handleAction";
import WrappedState from "../../types/WrappedState";
import effects from "../../data/effects";

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
    effects.CLEAR_UI_OVERHEAT(state, undefined, entity);
  } else if (status === "very hot") {
    state.act.updateEntity({
      id: entity.id,
      temperature: { ...entity.temperature, status: "hot" },
    });
  } else if (status === "critical") {
    state.act.updateEntity({
      id: entity.id,
      temperature: { ...entity.temperature, status: "very hot" },
    });
  }
}

registerHandler(temperatureDecreaseHandler, temperatureDecrease);
