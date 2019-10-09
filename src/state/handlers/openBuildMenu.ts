import { GameState } from "~types";
import * as actions from "~state/actions";
import { registerHandler } from "~state/handleAction";

function openBuildMenu(
  oldState: GameState,
  action: ReturnType<typeof actions.openBuildMenu>,
): GameState {
  return {
    ...oldState,
    isBuildMenuOpen: true,
  };
}

registerHandler(openBuildMenu, actions.openBuildMenu);
