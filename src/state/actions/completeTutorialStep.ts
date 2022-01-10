import { createAction } from "typesafe-actions";
import tutorials from "../../data/tutorials";
import { registerHandler } from "../handleAction";
import { TutorialId } from "../../types/TutorialId";
import WrappedState from "../../types/WrappedState";

const completeTutorialStep = createAction(
  "COMPLETE_TUTORIAL_STEP"
)<TutorialId>();
export default completeTutorialStep;

function completeTutorialStepHandler(
  state: WrappedState,
  action: ReturnType<typeof completeTutorialStep>
): void {
  const tutorialId = action.payload;
  const tutorialsState = state.raw.tutorials;
  const activeTutorial = tutorialsState.active.find((t) => t.id === tutorialId);
  if (!activeTutorial) {
    console.error(
      `Tried to complete a step in an inactive tutorial: ${tutorialId}`
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
          t.id === tutorialId ? { ...t, step: activeTutorial.step + 1 } : t
        ),
      },
    });
  }
}

registerHandler(completeTutorialStepHandler, completeTutorialStep);
