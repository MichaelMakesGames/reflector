import actions from "~/state/actions";
import { registerHandler } from "~state/handleAction";
import WrappedState from "~types/WrappedState";
import { createEntityFromTemplate } from "~utils/entities";

function finishPlacement(
  state: WrappedState,
  action: ReturnType<typeof actions.finishPlacement>,
): void {
  const placingTarget = state.select.placingTarget();
  if (!placingTarget) return;
  const { takesTurn } = placingTarget.placing;

  const { pos } = placingTarget;
  const entitiesAtPosition = state.select.entitiesAtPosition(pos);
  const isPosValid = entitiesAtPosition.some((entity) => entity.validMarker);
  if (!isPosValid) {
    const message = "Invalid position";
    state.act.logMessage({ message });
    return;
  }

  if (placingTarget.placing.cost) {
    const { cost } = placingTarget.placing;
    if (!state.select.canAffordToPay(cost.resource, cost.amount)) {
      console.warn("Failed to place due to cost. This should be impossible");
      return;
    } else {
      if (takesTurn) state.act.playerWillTakeTurn();
      state.act.modifyResource({
        resource: cost.resource,
        amount: -cost.amount,
        reason: "Building",
      });
    }
  } else if (takesTurn) {
    state.act.playerWillTakeTurn();
  }

  const otherReflector = entitiesAtPosition.find(
    (entity) => entity.reflector && entity !== placingTarget,
  );
  if (otherReflector) {
    state.act.removeEntity(otherReflector.id);
  }

  state.act.updateEntity({
    id: placingTarget.id,
    placing: undefined,
    display: createEntityFromTemplate(placingTarget.template).display,
  });

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
      pos: placingTarget.pos,
    });
  }
}

registerHandler(finishPlacement, actions.finishPlacement);
