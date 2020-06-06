import actions from "~state/actions";
import WrappedState from "~types/WrappedState";
import { registerHandler } from "~state/handleAction";
import { CURSOR_ID } from "~constants";
import { createEntityFromTemplate } from "~utils/entities";

function setCursorPos(
  state: WrappedState,
  action: ReturnType<typeof actions.setCursorPos>,
): void {
  const pos = action.payload;
  state.setRaw({
    ...state.raw,
    cursorPos: pos,
  });

  const cursor = state.select.entityById(CURSOR_ID);
  if (pos) {
    if (cursor) {
      state.act.updateEntity({
        ...cursor,
        pos,
      });
    } else {
      state.act.addEntity({
        ...createEntityFromTemplate("CURSOR", { pos }),
        id: CURSOR_ID,
      });
    }

    const placingTarget = state.select.placingTarget();
    if (placingTarget) {
      state.act.movePlacement({ to: pos });
    }
  } else if (cursor) {
    state.act.removeEntity(CURSOR_ID);
  }
}

registerHandler(setCursorPos, actions.setCursorPos);
