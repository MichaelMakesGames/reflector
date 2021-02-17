import { createStandardAction } from "typesafe-actions";
import { registerHandler } from "~state/handleAction";
import { TutorialId } from "~types/TutorialId";
import WrappedState from "~types/WrappedState";

const startTutorial = createStandardAction("START_TUTORIAL")<TutorialId>();
export default startTutorial;

function startTutorialHandler(
  state: WrappedState,
  action: ReturnType<typeof startTutorial>,
): void {
  const tutorialId = action.payload;
  const tutorialsState = state.raw.tutorials;
  state.setRaw({
    ...state.raw,
    tutorials: {
      completed: tutorialsState.completed.includes(tutorialId)
        ? tutorialsState.completed.filter((id) => id !== tutorialId)
        : tutorialsState.completed,
      active: [
        ...tutorialsState.active,
        {
          id: tutorialId,
          step: 0,
        },
      ],
    },
  });
}

registerHandler(startTutorialHandler, startTutorial);
