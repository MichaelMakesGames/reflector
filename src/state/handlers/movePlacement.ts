import colors from "~colors";
import { registerHandler } from "~state/handleAction";
import WrappedState from "~types/WrappedState";
import { arePositionsEqual } from "~utils/geometry";
import actions from "../actions";

function movePlacement(
  state: WrappedState,
  action: ReturnType<typeof actions.movePlacement>,
): void {
  const placingTarget = state.select.placingTarget();
  if (!placingTarget || !placingTarget.pos) return;
  const validPositions = state.select
    .entitiesWithComps("validMarker", "pos")
    .map((e) => e.pos);
  const { to: newPos } = action.payload;

  const isValid = validPositions.some((validPos) =>
    arePositionsEqual(validPos, newPos),
  );
  state.act.updateEntity({
    id: placingTarget.id,
    pos: newPos,
    display: {
      ...placingTarget.display,
      color: isValid ? colors.secondary : colors.invalid,
    },
  });
}

registerHandler(movePlacement, actions.movePlacement);
