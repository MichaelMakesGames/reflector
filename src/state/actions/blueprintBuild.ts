import { createStandardAction } from "typesafe-actions";
import resources from "~data/resources";
import { registerHandler } from "~state/handleAction";
import WrappedState from "~types/WrappedState";
import { areConditionsMet } from "~lib/conditions";
import { createEntityFromTemplate } from "~lib/entities";
import audio from "~lib/audio";
import effects from "~data/effects";

const blueprintBuild = createStandardAction("BLUEPRINT_BUILD")();
export default blueprintBuild;

function blueprintBuildHandler(
  state: WrappedState,
  action: ReturnType<typeof blueprintBuild>,
): void {
  const blueprint = state.select.blueprint();
  if (!blueprint) return;

  const playerPos = state.select.playerPos();
  if (!playerPos) return;

  const { pos } = blueprint;
  const entitiesAtPosition = state.select.entitiesAtPosition(pos);

  const isPosValid = entitiesAtPosition.some((entity) => entity.validMarker);
  if (!isPosValid) {
    const failedConditions = blueprint.blueprint.validityConditions.filter(
      (validityCondition) =>
        !areConditionsMet(state, blueprint, validityCondition.condition),
    );
    const message = failedConditions[0]
      ? failedConditions[0].invalidMessage
      : "Invalid position.";
    state.act.logMessage({ message });
    return;
  }

  if (blueprint.blueprint.cost) {
    const { cost } = blueprint.blueprint;
    if (!state.select.canAffordToPay(cost.resource, cost.amount)) {
      state.act.logMessage({
        message: `Cannot afford building (${cost.amount} ${
          resources[cost.resource].label
        })`,
      });
      return;
    } else {
      state.act.modifyResource({
        resource: cost.resource,
        amount: -cost.amount,
        reason: "Building",
      });
    }
  }

  const entitiesToReplace = entitiesAtPosition.filter((e) =>
    (blueprint.blueprint.canReplace || []).includes(e.template),
  );

  state.act.removeEntity(blueprint.id);
  const building = createEntityFromTemplate(blueprint.blueprint.builds, {
    pos: blueprint.pos,
  });
  state.act.addEntity(building);

  state.act.removeEntities([
    ...state.select.entitiesWithComps("validMarker").map((e) => e.id),
    ...entitiesToReplace.map((e) => e.id),
  ]);

  if (blueprint.blueprint.onBuild) {
    effects[blueprint.blueprint.onBuild](state, blueprint, building);
  }

  state.act.playerTookTurn();

  state.act.blueprintSelect(blueprint.template);

  audio.playAtPos("building_built", blueprint.pos);
}

registerHandler(blueprintBuildHandler, blueprintBuild);
