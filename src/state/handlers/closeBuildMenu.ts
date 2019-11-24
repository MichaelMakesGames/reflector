import actions from "~state/actions";
import { registerHandler } from "~state/handleAction";
import WrappedState from "~types/WrappedState";

function closeBuildMenu(
  state: WrappedState,
  action: ReturnType<typeof actions.closeBuildMenu>,
): void {
  state.setRaw({
    ...state.raw,
    isBuildMenuOpen: false,
  });
}

registerHandler(closeBuildMenu, actions.closeBuildMenu);
