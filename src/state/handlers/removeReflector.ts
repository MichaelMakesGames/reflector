import colors from "~colors";
import actions from "~state/actions";
import { registerHandler } from "~state/handleAction";
import WrappedState from "~types/WrappedState";
import { createEntityFromTemplate } from "~utils/entities";
import { arePositionsEqual } from "~utils/geometry";

function removeReflector(
  state: WrappedState,
  action: ReturnType<typeof actions.removeReflector>,
): void {
  const pos = action.payload;
  const placingTarget = state.select.placingTarget();
  const placingMarker = state.select.placingMarker();
  if (!placingTarget || !placingMarker) return;
  const entitiesAtPosition = state.select.entitiesAtPosition(pos);
  const otherReflector = entitiesAtPosition.find(
    e => e.reflector && e !== placingTarget,
  );

  if (!otherReflector) {
    const message = "No reflector to remove.";
    state.act.logMessage({ message });
  } else {
    state.act.removeEntity(otherReflector.id);
    state.act.addEntity(
      createEntityFromTemplate("VALID_MARKER", {
        pos: otherReflector.pos,
      }),
    );
    if (arePositionsEqual(pos, placingMarker.pos)) {
      state.act.updateEntity({
        ...placingMarker,
        display: {
          ...placingMarker.display,
          color: colors.secondary,
        },
      });
    }
  }
}

registerHandler(removeReflector, actions.removeReflector);
