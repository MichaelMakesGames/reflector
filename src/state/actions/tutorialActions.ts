import { createStandardAction } from "typesafe-actions";
import { TutorialId } from "~types/TutorialId";

export const startTutorial = createStandardAction("START_TUTORIAL")<
  TutorialId
>();

export const completeTutorial = createStandardAction("COMPLETE_TUTORIAL")<
  TutorialId
>();

export const completeTutorialStep = createStandardAction(
  "COMPLETE_TUTORIAL_STEP",
)<TutorialId>();

export const resetTutorials = createStandardAction("RESET_TUTORIALS")();
