import WrappedState from "~types/WrappedState";
import actions from "~state/actions";
import { createEntityFromTemplate } from "~utils/entities";
import { registerHandler } from "~state/handleAction";

function activateDisableMode(
  state: WrappedState,
  action: ReturnType<typeof actions.activateDisableMode>,
): void {
  const player = state.select.player();
  if (!player) return;

  state.act.addEntity(
    createEntityFromTemplate("DISABLE_MARKER", { pos: player.pos }),
  );
}

registerHandler(activateDisableMode, actions.activateDisableMode);
