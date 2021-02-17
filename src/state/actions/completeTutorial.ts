import { createStandardAction } from "typesafe-actions";
import { registerHandler } from "~state/handleAction";
import { TutorialId } from "~types/TutorialId";
import WrappedState from "~types/WrappedState";

const completeTutorial = createStandardAction("COMPLETE_TUTORIAL")<
  TutorialId
>();
export default completeTutorial;

function completeTutorialHandler(
  state: WrappedState,
  action: ReturnType<typeof completeTutorial>,
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

registerHandler(completeTutorialHandler, completeTutorial);
