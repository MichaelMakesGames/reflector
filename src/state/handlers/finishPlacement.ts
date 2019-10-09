import * as actions from "~/state/actions";
import * as selectors from "~/state/selectors";
import { GameState } from "~/types";
import { getDistance } from "~/utils/geometry";
import handleAction, { registerHandler } from "~state/handleAction";

function finishPlacement(
  state: GameState,
  action: ReturnType<typeof actions.finishPlacement>,
): GameState {
  let newState = state;
  newState = handleAction(
    newState,
    actions.removeEntities({
      entityIds: selectors
        .entityList(newState)
        .filter(e => e.fov)
        .map(e => e.id),
    }),
  );
  const placingTarget = selectors.placingTarget(newState);
  if (!placingTarget) return newState;

  const player = selectors.player(newState);
  if (!player) return newState;

  const { pos } = placingTarget;
  const distance = getDistance(pos, player.pos);
  if (distance > placingTarget.placing.range) return newState;

  const entitiesAtPosition = selectors.entitiesAtPosition(newState, pos);
  if (entitiesAtPosition.some(e => e.id !== placingTarget.id && !!e.blocking))
    return newState;

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

  return newState;
}

registerHandler(finishPlacement, actions.finishPlacement);
