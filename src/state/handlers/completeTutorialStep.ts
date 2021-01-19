import tutorials from "~data/tutorials";
import actions from "~state/actions";
import { registerHandler } from "~state/handleAction";
import WrappedState from "~types/WrappedState";

function completeTutorialStep(
  state: WrappedState,
  action: ReturnType<typeof actions.completeTutorialStep>,
): void {
  const tutorialId = action.payload;
  const tutorialsState = state.raw.tutorials;
  const activeTutorial = tutorialsState.active.find((t) => t.id === tutorialId);
  if (!activeTutorial) {
    console.warn(
      `Tried to complete a step in an inactive tutorial: ${tutorialId}`,
    );
    return;
  }
  const isLastStep =
    activeTutorial.step >= tutorials[tutorialId].steps.length - 1;
  if (isLastStep) {
    state.act.completeTutorial(tutorialId);
  } else {
    state.setRaw({
      ...state.raw,
      tutorials: {
        ...tutorialsState,
        active: tutorialsState.active.map((t) =>
          t.id === tutorialId ? { ...t, step: activeTutorial.step + 1 } : t,
        ),
      },
    });
  }
}

registerHandler(completeTutorialStep, actions.completeTutorialStep);
