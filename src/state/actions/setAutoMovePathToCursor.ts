import { createStandardAction } from "typesafe-actions";
import { registerHandler } from "~state/handleAction";
import WrappedState from "~types/WrappedState";
import { getPath } from "~lib/ai";

const setAutoMovePathToCursor = createStandardAction(
  "SET_AUTO_MOVE_PATH_TO_CURSOR",
)();
export default setAutoMovePathToCursor;

function setAutoMovePathToCursorHandler(state: WrappedState) {
  const player = state.select.player();
  const playerPos = state.select.playerPos();
  const cursorPos = state.select.cursorPos();
  if (
    player &&
    playerPos &&
    cursorPos &&
    !state.raw.isAutoMoving &&
    !state.select.hasActiveBlueprint() &&
    !state.select.isWeaponActive()
  ) {
    const pathPreviews = state.select.entitiesWithComps("pathPreview", "pos");
    state.act.removeEntities(pathPreviews.map((e) => e.id));
    const path = getPath(playerPos, cursorPos, player, state);
    if (path) {
      state.act.setAutoMovePath(path);
    }
  }
}

registerHandler(setAutoMovePathToCursorHandler, setAutoMovePathToCursor);
