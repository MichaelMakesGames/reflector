import actions from "~state/actions";
import { registerHandler } from "~state/handleAction";
import WrappedState from "~types/WrappedState";

function openBuildMenu(
  state: WrappedState,
  action: ReturnType<typeof actions.openBuildMenu>,
): void {
  state.setRaw({
    ...state.raw,
    isBuildMenuOpen: true,
  });
}

registerHandler(openBuildMenu, actions.openBuildMenu);
