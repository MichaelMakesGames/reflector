import * as actions from "~/state/actions";
import * as selectors from "~/state/selectors";
import { GameState } from "~/types";
import { getDistance } from "~/utils/geometry";
import handleAction, { registerHandler } from "~state/handleAction";

function executeThrow(
  state: GameState,
  action: ReturnType<typeof actions.executeThrow>,
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
  const throwingTarget = selectors.throwingTarget(newState);
  if (!throwingTarget) return newState;

  const player = selectors.player(newState);
  if (!player) return newState;

  const { pos } = throwingTarget;
  const distance = getDistance(pos, player.pos);
  if (distance > throwingTarget.throwing.range) return newState;

  const entitiesAtPosition = selectors.entitiesAtPosition(newState, pos);
  if (entitiesAtPosition.some(e => e.id !== throwingTarget.id && !!e.blocking))
    return newState;

  const otherReflector = entitiesAtPosition.find(
    entity => entity.reflector && entity !== throwingTarget,
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
      id: throwingTarget.id,
      throwing: undefined,
    }),
  );

  return newState;
}

registerHandler(executeThrow, actions.executeThrow);
