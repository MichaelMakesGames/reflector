import { createStandardAction } from "typesafe-actions";
import { registerHandler } from "~state/handleAction";
import WrappedState from "~types/WrappedState";
import { createEntityFromTemplate } from "~lib/entities";
import resources from "~data/resources";
import audio from "~lib/audio";

const rebuild = createStandardAction("rebuild")<string>();
export default rebuild;

function rebuildHandler(
  state: WrappedState,
  action: ReturnType<typeof rebuild>,
): void {
  const entity = state.select.entityById(action.payload);
  if (!entity || !entity.rebuildable || !entity.pos) return;
  const blueprint = createEntityFromTemplate(entity.rebuildable.blueprint);
  if (!blueprint.blueprint) return;
  const { cost } = blueprint.blueprint;
  if (state.select.canAffordToPay(cost.resource, cost.amount)) {
    state.act.removeEntity(entity.id);
    state.act.addEntity(
      createEntityFromTemplate(blueprint.blueprint.builds, { pos: entity.pos }),
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
