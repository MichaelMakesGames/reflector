import { createAction } from "typesafe-actions";
import { registerHandler } from "../handleAction";
import { TutorialId } from "../../types/TutorialId";
import WrappedState from "../../types/WrappedState";

const completeTutorial = createAction("COMPLETE_TUTORIAL")<TutorialId>();
export default completeTutorial;

function completeTutorialHandler(
  state: WrappedState,
  action: ReturnType<typeof completeTutorial>
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
