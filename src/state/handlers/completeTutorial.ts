import actions from "~state/actions";
import { registerHandler } from "~state/handleAction";
import WrappedState from "~types/WrappedState";

function completeTutorial(
  state: WrappedState,
  action: ReturnType<typeof actions.completeTutorial>,
): void {
  const tutorialId = action.payload;
  const tutorialsState = state.raw.tutorials;
  state.setRaw({
    ...state.raw,
    tutorials: {
      completed: [...tutorialsState.completed, tutorialId],
      active: tutorialsState.active.filter((t) => t.id !== tutorialId),
    },
  });
}

registerHandler(completeTutorial, actions.completeTutorial);
