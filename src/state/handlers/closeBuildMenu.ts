import * as actions from "~state/actions";
import { GameState } from "~types";
import { registerHandler } from "~state/handleAction";

function closeBuildMenu(
  oldState: GameState,
  action: ReturnType<typeof actions.closeBuildMenu>,
): GameState {
  return {
    ...oldState,
    isBuildMenuOpen: false,
  };
}

registerHandler(closeBuildMenu, actions.closeBuildMenu);
