import * as actions from "~/state/actions";
import * as selectors from "~/state/selectors";
import { GameState } from "~/types";
import handleAction, { registerHandler } from "~state/handleAction";

function finishPlacement(
  state: GameState,
  action: ReturnType<typeof actions.finishPlacement>,
): GameState {
  let newState = state;

  const placingTarget = selectors.placingTarget(newState);
  if (!placingTarget) return newState;

  if (placingTarget.placing.cost) {
    const { cost } = placingTarget.placing;
    if (newState.resources[cost.resource] < cost.amount) {
      return newState;
    } else {
      newState = {
        ...newState,
        resources: {
          ...newState.resources,
          [cost.resource]: newState.resources[cost.resource] - cost.amount,
        },
      };
    }
  }

  const { pos } = placingTarget;
  const entitiesAtPosition = selectors.entitiesAtPosition(newState, pos);
  const isPosValid = entitiesAtPosition.some(entity => entity.validMarker);
  if (!isPosValid) return newState;

  const otherReflector = entitiesAtPosition.find(
    entity => entity.reflector && entity !== placingTarget,
  );
  if (otherReflector) {
    newState = handleAction(
      newState,
      actions.removeEntity({ entityId: otherReflector.id }),
    );
  }

  newState = handleAction(
    newState,
    actions.updateEntity({
      id: placingTarget.id,
      placing: undefined,
    }),
  );

  newState = handleAction(
    newState,
    actions.removeEntities({
      entityIds: selectors
        .entityList(newState)
        .filter(e => e.validMarker)
        .map(e => e.id),
    }),
  );

  return newState;
}

registerHandler(finishPlacement, actions.finishPlacement);
