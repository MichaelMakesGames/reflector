import colors from "~colors";
import { registerHandler } from "~state/handleAction";
import WrappedState from "~types/WrappedState";
import { arePositionsEqual } from "~utils/geometry";
import actions from "../actions";

function blueprintMove(
  state: WrappedState,
  action: ReturnType<typeof actions.blueprintMove>,
): void {
  const blueprint = state.select.blueprint();
  if (!blueprint || !blueprint.pos) return;
  const validPositions = state.select
    .entitiesWithComps("validMarker", "pos")
    .map((e) => e.pos);
  const { to: newPos } = action.payload;

  const isValid = validPositions.some((validPos) =>
    arePositionsEqual(validPos, newPos),
  );
  state.act.updateEntity({
    id: blueprint.id,
    pos: newPos,
    display: {
      ...blueprint.display,
      color: isValid ? colors.blueprint : colors.invalid,
    },
  });
}

registerHandler(blueprintMove, actions.blueprintMove);
