import tutorials from "~data/tutorials";
import { Action } from "~types";
import WrappedState from "~types/WrappedState";
import { save } from "~lib/gameSave";

export function processTutorials(
  prevState: WrappedState,
  nextState: WrappedState,
  action: Action,
): void {
  let isDirty = false;

  for (const activeTutorial of nextState.select.activeTutorials()) {
    const tutorial = tutorials[activeTutorial.id];
    const step = tutorial.steps[activeTutorial.step];
    if (!step) {
      nextState.act.completeTutorial(tutorial.id);
      isDirty = true;
    } else if (step.checkForCompletion(prevState, nextState, action)) {
      nextState.act.completeTutorialStep(tutorial.id);
      isDirty = true;
    }
  }

  for (const tutorial of Object.values(tutorials)) {
    if (
      !nextState.select.isTutorialCompleted(tutorial.id) &&
      !nextState.select.isTutorialActive(tutorial.id) &&
      tutorial.triggerSelector(nextState.raw)
    ) {
      nextState.act.startTutorial(tutorial.id);
      isDirty = true;
    }
  }

  if (isDirty) {
    save(nextState.raw);
  }
}
