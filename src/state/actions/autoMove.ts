import { createAction } from "typesafe-actions";
import { registerHandler } from "../handleAction";
import { Direction } from "../../types";
import WrappedState from "../../types/WrappedState";

const autoMove = createAction("AUTO_MOVE")();
export default autoMove;

function autoMoveHandler(state: WrappedState): void {
  const player = state.select.player();
  if (!player) return;

  const path = state.select
    .entitiesWithComps("pathPreview", "pos")
    .sort((a, b) => a.pathPreview.index - b.pathPreview.index);

  if (!path.length) {
    state.act.cancelAutoMove();
    return;
  }

  state.setRaw({
    ...state.raw,
    isAutoMoving: true,
  });

  const [next, ...rest] = path;
  const direction: Direction = {
    dx: next.pos.x - player.pos.x,
    dy: next.pos.y - player.pos.y,
  };

  if (Math.abs(direction.dx) + Math.abs(direction.dy) !== 1) {
    console.error(
      `Invalid auto-move from ${player.pos.x},${player.pos.y} to ${next.pos.x},${next.pos.y}`
    );
    state.act.cancelAutoMove();
    return;
  }

  state.act.move({ entityId: player.id, ...direction });
  state.act.removeEntity(next.id);
  if (rest.length === 0) {
    state.act.cancelAutoMove();
  } else if (state.select.areEnemiesPresent()) {
    state.act.cancelAutoMove();
    state.act.logMessage({
      message: "Enemies present, movement canceled",
      type: "info",
    });
  }
}

registerHandler(autoMoveHandler, autoMove);
