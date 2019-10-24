import * as actions from "~/state/actions";
import * as selectors from "~/state/selectors";
import { GameState } from "~/types";
import handleAction, { registerHandler } from "~state/handleAction";

function finishPlacement(
  prevState: GameState,
  action: ReturnType<typeof actions.finishPlacement>,
): GameState {
  let state = prevState;

  const placingTarget = selectors.placingTarget(state);
  const placingMarker = selectors.placingMarker(state);
  if (!placingTarget || !placingMarker) return state;

  if (placingTarget.placing.cost) {
    const { cost } = placingTarget.placing;
    if (state.resources[cost.resource] < cost.amount) {
      return state;
    } else {
      state = {
        ...state,
        resources: {
          ...state.resources,
          [cost.resource]: state.resources[cost.resource] - cost.amount,
        },
      };
    }
  }

  const { pos } = placingTarget;
  const entitiesAtPosition = selectors.entitiesAtPosition(state, pos);
  const isPosValid = entitiesAtPosition.some(entity => entity.validMarker);
  if (!isPosValid) return state;

  const otherReflector = entitiesAtPosition.find(
    entity => entity.reflector && entity !== placingTarget,
  );
  if (otherReflector) {
    state = handleAction(
      state,
      actions.removeEntity({ entityId: otherReflector.id }),
    );
  }

  state = handleAction(
    state,
    actions.updateEntity({
      id: placingTarget.id,
      placing: undefined,
    }),
  );

  state = handleAction(
    state,
    actions.removeEntities({
      entityIds: selectors
        .entityList(state)
        .filter(e => e.validMarker)
        .map(e => e.id)
        .concat([placingMarker.id]),
    }),
  );

  if (placingTarget.placing.takesTurn) {
    state = handleAction(state, actions.playerTookTurn());
  }

  return state;
}

registerHandler(finishPlacement, actions.finishPlacement);
