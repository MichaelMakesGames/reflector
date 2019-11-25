import actions from "~state/actions";
import { registerHandler } from "~state/handleAction";
import WrappedState from "~types/WrappedState";

function mine(
  state: WrappedState,
  action: ReturnType<typeof actions.mine>,
): void {
  const player = state.select.player();
  if (!player) return;

  const adjacentEntities = state.select.adjacentEntities(player.pos);
  const entitiesAtPosition = state.select.entitiesAtPosition(player.pos);
  const presentAndAdjacentEntities = adjacentEntities.concat(
    entitiesAtPosition,
  );

  if (
    presentAndAdjacentEntities.some(
      entity => entity.mineable && entity.mineable.resource === "METAL",
    )
  ) {
    state.setRaw({
      ...state.raw,
      resources: {
        ...state.raw.resources,
        METAL: state.raw.resources.METAL + 1,
      },
    });
    state.act.playerTookTurn();
  } else {
    const message = "Must be next to ore to mine";
    state.act.logMessage({ message });
  }
}

registerHandler(mine, actions.mine);
