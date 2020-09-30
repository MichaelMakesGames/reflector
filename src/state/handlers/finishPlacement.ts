import actions from "~/state/actions";
import { registerHandler } from "~state/handleAction";
import WrappedState from "~types/WrappedState";
import { createEntityFromTemplate } from "~utils/entities";
import resources from "~data/resources";
import { getDistance } from "~utils/geometry";
import { BUILDING_RANGE } from "~constants";

function finishPlacement(
  state: WrappedState,
  action: ReturnType<typeof actions.finishPlacement>,
): void {
  const placingTarget = state.select.placingTarget();
  if (!placingTarget) return;

  const playerPos = state.select.playerPos();
  if (!playerPos) return;

  const { pos } = placingTarget;
  const entitiesAtPosition = state.select.entitiesAtPosition(pos);

  const isPositionInRange = getDistance(pos, playerPos) <= BUILDING_RANGE;
  if (!isPositionInRange) {
    state.act.logMessage({
      message: `That is too far away. You cannot build more than ${BUILDING_RANGE} tiles away.`,
    });
    return;
  }
  const isPosValid = entitiesAtPosition.some((entity) => entity.validMarker);
  if (!isPosValid) {
    const message = placingTarget.placing.invalidMessage || "Invalid position.";
    state.act.logMessage({ message });
    return;
  }

  if (placingTarget.placing.cost) {
    const { cost } = placingTarget.placing;
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

  const otherReflector = entitiesAtPosition.find(
    (entity) => entity.reflector && entity !== placingTarget,
  );
  if (otherReflector) {
    state.act.removeEntity(otherReflector.id);
  }

  state.act.removeEntity(placingTarget.id);
  state.act.addEntity(
    createEntityFromTemplate(placingTarget.template, {
      pos: placingTarget.pos,
    }),
  );

  state.act.removeEntities(
    state.select.entitiesWithComps("validMarker").map((e) => e.id),
  );

  if (placingTarget.placing.takesTurn) {
    state.act.playerTookTurn();
  }

  if (action.payload.placeAnother) {
    state.act.activatePlacement({
      template: placingTarget.template,
      takesTurn: placingTarget.placing.takesTurn,
      cost: placingTarget.placing.cost,
      validitySelector: placingTarget.placing.validitySelector,
      invalidMessage: placingTarget.placing.invalidMessage,
      pos: placingTarget.pos,
    });
  }
}

registerHandler(finishPlacement, actions.finishPlacement);
