import { registerHandler } from "~state/handleAction";
import WrappedState from "~types/WrappedState";
import { createEntityFromTemplate } from "~utils/entities";
import actions from "../actions";

function inspect(
  state: WrappedState,
  action: ReturnType<typeof actions.inspect>,
): void {
  const player = state.select.player();
  if (!player) return;
  state.act.addEntity(
    createEntityFromTemplate("INSPECTOR", { pos: player.pos }),
  );
}

registerHandler(inspect, actions.inspect);
