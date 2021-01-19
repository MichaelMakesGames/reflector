import { Action } from "./Action";
import { RawState } from "./RawState";
import { TutorialId } from "./TutorialId";
import WrappedState from "./WrappedState";

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
    action: Action,
  ) => boolean;
  elementHighlightSelectors?: string[];
  isDismissible?: boolean;
}
