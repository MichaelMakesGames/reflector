import type { RawState } from "../../types";
import { TutorialId } from "../../types/TutorialId";

export function tutorialsState(state: RawState) {
  return state.tutorials;
}

export function completedTutorials(state: RawState) {
  return tutorialsState(state).completed;
}

export function activeTutorials(state: RawState) {
  return tutorialsState(state).active;
}

export function isTutorialCompleted(state: RawState, tutorial: TutorialId) {
  return completedTutorials(state).includes(tutorial);
}

export function isTutorialActive(state: RawState, tutorial: TutorialId) {
  return activeTutorials(state).some((t) => t.id === tutorial);
}
