import { createAction } from "typesafe-actions";
import { registerHandler } from "../handleAction";
import WrappedState from "../../types/WrappedState";
import { createEntityFromTemplate } from "../../lib/entities";
import resources from "../../data/resources";
import audio from "../../lib/audio";
import { areConditionsMet } from "../../lib/conditions";

const rebuild = createAction("rebuild")<string>();
export default rebuild;

function rebuildHandler(
  state: WrappedState,
  action: ReturnType<typeof rebuild>
): void {
  const entity = state.select.entityById(action.payload);
  if (!entity || !entity.rebuildable || !entity.pos) return;
  const blueprint = createEntityFromTemplate(entity.rebuildable.blueprint, {
    pos: entity.pos,
  });
  if (!blueprint.blueprint) return;

  const failedConditions = blueprint.blueprint.validityConditions.filter(
    (validityCondition) =>
      !areConditionsMet(state, blueprint, validityCondition.condition)
  );
  if (failedConditions.length) {
    const message = failedConditions[0]
      ? failedConditions[0].invalidMessage
      : "Invalid position.";
    state.act.logMessage({ message });
    return;
  }

  const { cost } = blueprint.blueprint;
  if (state.select.canAffordToPay(cost.resource, cost.amount)) {
    state.act.removeEntity(entity.id);
    state.act.addEntity(
      createEntityFromTemplate(blueprint.blueprint.builds, { pos: entity.pos })
    );
    state.act.modifyResource({
      resource: cost.resource,
      amount: -cost.amount,
      reason: "Rebuild",
    });
    audio.playAtPos("building_built", entity.pos);
    state.act.playerTookTurn();
  } else {
    state.act.logMessage({
      message: `Cannot afford building (${cost.amount} ${
        resources[cost.resource].label
      })`,
    });
  }
}

registerHandler(rebuildHandler, rebuild);
