import { createStandardAction } from "typesafe-actions";
import { registerHandler } from "~state/handleAction";
import WrappedState from "~types/WrappedState";
import effects from "~data/effects";
import { createEntityFromTemplate } from "~lib/entities";

const temperatureIncrease = createStandardAction("temperatureIncrease")<
  string
>();
export default temperatureIncrease;

function temperatureIncreaseHandler(
  state: WrappedState,
  action: ReturnType<typeof temperatureIncrease>,
): void {
  const entity = state.select.entityById(action.payload);
  if (!entity || !entity.temperature) return;
  const { status } = entity.temperature;
  if (status === "normal") {
    state.act.updateEntity({
      id: entity.id,
      temperature: { ...entity.temperature, status: "hot" },
    });
    state.act.addEntity(
      createEntityFromTemplate("UI_OVERHEATING", { pos: entity.pos }),
    );
  } else if (status === "hot") {
    state.act.updateEntity({
      id: entity.id,
      temperature: { ...entity.temperature, status: "very hot" },
    });
  } else if (status === "very hot") {
    state.act.updateEntity({
      id: entity.id,
      temperature: { ...entity.temperature, status: "critical" },
    });
  } else if (status === "critical") {
    effects[entity.temperature.onOverheat](state, undefined, entity);
  }
}

registerHandler(temperatureIncreaseHandler, temperatureIncrease);
