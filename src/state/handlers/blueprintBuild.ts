import actions from "~/state/actions";
import resources from "~data/resources";
import { registerHandler } from "~state/handleAction";
import WrappedState from "~types/WrappedState";
import { areConditionsMet } from "~utils/conditions";
import { createEntityFromTemplate } from "~utils/entities";

function blueprintBuild(
  state: WrappedState,
  action: ReturnType<typeof actions.blueprintBuild>,
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
        message: `Cannot afford building. You need ${cost.amount} ${
          resources[cost.resource].label
        }.`,
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
  state.act.addEntity(
    createEntityFromTemplate(blueprint.blueprint.builds, {
      pos: blueprint.pos,
    }),
  );

  state.act.removeEntities([
    ...state.select.entitiesWithComps("validMarker").map((e) => e.id),
    ...entitiesToReplace.map((e) => e.id),
  ]);

  state.act.playerTookTurn();

  state.act.blueprintSelect(blueprint.template);
}

registerHandler(blueprintBuild, actions.blueprintBuild);
