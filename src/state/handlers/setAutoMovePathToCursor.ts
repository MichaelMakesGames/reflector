import actions from "~state/actions";
import { registerHandler } from "~state/handleAction";
import WrappedState from "~types/WrappedState";
import { getPath } from "~utils/ai";

function setAutoMovePathToCursor(state: WrappedState) {
  const playerPos = state.select.playerPos();
  const cursorPos = state.select.cursorPos();
  if (
    playerPos &&
    cursorPos &&
    !state.raw.isAutoMoving &&
    !state.select.hasActiveBlueprint() &&
    !state.select.isWeaponActive()
  ) {
    const pathPreviews = state.select.entitiesWithComps("pathPreview", "pos");
    state.act.removeEntities(pathPreviews.map((e) => e.id));
    const path = getPath(playerPos, cursorPos, state);
    if (path) {
      state.act.setAutoMovePath(path);
    }
  }
}

registerHandler(setAutoMovePathToCursor, actions.setAutoMovePathToCursor);
