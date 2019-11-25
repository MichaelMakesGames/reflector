import actions from "~/state/actions";
import { registerHandler } from "~state/handleAction";
import WrappedState from "~types/WrappedState";

function finishPlacement(
  state: WrappedState,
  action: ReturnType<typeof actions.finishPlacement>,
): void {
  const placingTarget = state.select.placingTarget();
  const placingMarker = state.select.placingMarker();
  if (!placingTarget || !placingMarker) return;

  const { pos } = placingTarget;
  const entitiesAtPosition = state.select.entitiesAtPosition(pos);
  const isPosValid = entitiesAtPosition.some(entity => entity.validMarker);
  if (!isPosValid) {
    const message = "Invalid position";
    state.act.logMessage({ message });
    return;
  }

  if (placingTarget.placing.cost) {
    const { cost } = placingTarget.placing;
    if (state.raw.resources[cost.resource] < cost.amount) {
      console.warn("Failed to place due to cost. This should be impossible");
      return;
    } else {
      state.setRaw({
        ...state.raw,
        resources: {
          ...state.raw.resources,
          [cost.resource]: state.raw.resources[cost.resource] - cost.amount,
        },
      });
    }
  }

  const otherReflector = entitiesAtPosition.find(
    entity => entity.reflector && entity !== placingTarget,
  );
  if (otherReflector) {
    state.act.removeEntity({ entityId: otherReflector.id });
  }

  state.act.updateEntity({
    id: placingTarget.id,
    placing: undefined,
  });

  state.act.removeEntities({
    entityIds: state.select
      .entitiesWithComps("validMarker")
      .map(e => e.id)
      .concat([placingMarker.id]),
  });

  if (placingTarget.placing.takesTurn) {
    state.act.playerTookTurn();
  }

  if (action.payload.placeAnother) {
    state.act.activatePlacement({
      template: "REFLECTOR_UP_RIGHT",
      takesTurn: false,
      validitySelector: "canPlaceReflector",
      pos: placingTarget.pos,
    });
  }
}

registerHandler(finishPlacement, actions.finishPlacement);
