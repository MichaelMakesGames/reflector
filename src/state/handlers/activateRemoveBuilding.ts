import { registerHandler } from "~state/handleAction";
import WrappedState from "~types/WrappedState";
import { createEntityFromTemplate } from "~utils/entities";
import actions from "../actions";

function activateRemoveBuilding(
  state: WrappedState,
  action: ReturnType<typeof actions.activateRemoveBuilding>,
): void {
  const player = state.select.player();
  if (!player) return;
  state.act.addEntity(
    createEntityFromTemplate("REMOVING_MARKER", { pos: player.pos }),
  );
}

registerHandler(activateRemoveBuilding, actions.activateRemoveBuilding);
