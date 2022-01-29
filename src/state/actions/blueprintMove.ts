import { createAction } from "typesafe-actions";
import colors from "../../colors";
import { registerHandler } from "../handleAction";
import { Pos } from "../../types";
import WrappedState from "../../types/WrappedState";
import { arePositionsEqual } from "../../lib/geometry";
import { areConditionsMet } from "../../lib/conditions";

const blueprintMove = createAction("BLUEPRINT_MOVE")<{
  to: Pos;
}>();
export default blueprintMove;

function blueprintMoveHandler(
  state: WrappedState,
  action: ReturnType<typeof blueprintMove>
): void {
  const blueprint = state.select.blueprint();
  if (!blueprint || !blueprint.pos) return;
  const validPositions = state.select
    .entitiesWithComps("validMarker", "pos")
    .map((e) => e.pos);
  const { to: newPos } = action.payload;

  const isValid = validPositions.some((validPos) =>
    arePositionsEqual(validPos, newPos)
  );

  const invalidMessage = isValid
    ? ""
    : blueprint.blueprint.validityConditions.filter(
        (vc) =>
          !areConditionsMet(state, { ...blueprint, pos: newPos }, vc.condition)
      )[0]?.invalidMessage ?? "";

  state.act.updateEntity({
    id: blueprint.id,
    pos: newPos,
    display: {
      ...blueprint.display,
      color: isValid ? colors.blueprint : colors.invalid,
    },
    warning: invalidMessage ? { text: invalidMessage } : undefined,
  });

  state.act.bordersUpdate();
}

registerHandler(blueprintMoveHandler, blueprintMove);
