import actions from "~state/actions";
import { registerHandler } from "~state/handleAction";
import WrappedState from "~types/WrappedState";

function startTutorial(
  state: WrappedState,
  action: ReturnType<typeof actions.startTutorial>,
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

registerHandler(startTutorial, actions.startTutorial);
