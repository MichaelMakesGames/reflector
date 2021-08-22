import type { Action } from "./Action";
import type { RawState } from "./RawState";
import type { TutorialId } from "./TutorialId";
import type WrappedState from "./WrappedState";

export interface Tutorial {
  id: TutorialId;
  label: string;
  triggerSelector: (state: RawState) => boolean;
  steps: TutorialStep[];
}

export interface TutorialStep {
  text: string;
  checkForCompletion: (
    prevState: WrappedState,
    nextState: WrappedState,
    action: Action
  ) => boolean;
  elementHighlightSelectors?: string[];
  isDismissible?: boolean;
}
