/* global document, MutationObserver */
import Tippy from "@tippyjs/react";
import React, { useContext, useEffect, useState } from "react";
import Draggable from "react-draggable";
import { useIntl } from "react-intl";
import { useDispatch, useSelector } from "react-redux";
import { SettingsContext } from "~contexts";
import tutorials from "~data/tutorials";
import { useBoolean } from "~hooks";
import actions from "~state/actions";
import selectors from "~state/selectors";
import { ControlCode } from "~types/ControlCode";
import { TutorialId } from "~types/TutorialId";
import { noFocusOnClick } from "~lib/controls";
import EntityPreview from "./EntityPreview";
import { HotkeyGroup, useControl } from "./HotkeysProvider";
import Icons from "./Icons";
import Kbd from "./Kbd";

export default function Tutorials() {
  const activeTutorials = useSelector(selectors.activeTutorials);
  const [isExpanded, expand, minimize, toggle] = useBoolean(true);
  const [focusedTutorialIndex, setFocusedTutorialIndex] = useState<
    null | number
  >(null);
  const isSomeTutorialFocused = focusedTutorialIndex !== null;
  const settings = useContext(SettingsContext);

  useControl({
    code: ControlCode.FocusTutorials,
    callback: () => {
      expand();
      setFocusedTutorialIndex(0);
    },
    shift: false,
    group: HotkeyGroup.Main,
    allowedGroups: [HotkeyGroup.JobPriorities, HotkeyGroup.BuildingSelection],
    disabled: isSomeTutorialFocused || activeTutorials.length === 0,
  });

  useControl({
    code: ControlCode.FocusTutorials,
    callback: () => setFocusedTutorialIndex(null),
    shift: false,
    group: HotkeyGroup.Tutorial,
    disabled: !isSomeTutorialFocused,
  });

  useControl({
    code: ControlCode.ToggleTutorials,
    callback: () => setTimeout(toggle, 0),
    group: HotkeyGroup.Main,
    allowedGroups: [
      HotkeyGroup.JobPriorities,
      HotkeyGroup.BuildingSelection,
      HotkeyGroup.Tutorial,
    ],
  });

  useControl({
    code: ControlCode.Back,
    callback: () => setFocusedTutorialIndex(null),
    group: HotkeyGroup.Tutorial,
    disabled: !isSomeTutorialFocused,
  });

  useControl({
    code: ControlCode.Up,
    callback: () =>
      setFocusedTutorialIndex(
        (focusedTutorialIndex !== null ? focusedTutorialIndex : 1) - 1,
      ),
    group: HotkeyGroup.Tutorial,
    disabled: !isSomeTutorialFocused || focusedTutorialIndex === 0,
  });

  useControl({
    code: ControlCode.Down,
    callback: () =>
      setFocusedTutorialIndex(
        (focusedTutorialIndex !== null ? focusedTutorialIndex : -1) + 1,
      ),
    group: HotkeyGroup.Tutorial,
    disabled:
      !isSomeTutorialFocused ||
      focusedTutorialIndex === activeTutorials.length - 1,
  });

  useEffect(() => {
    expand();
    if (
      focusedTutorialIndex !== null &&
      focusedTutorialIndex >= activeTutorials.length
    ) {
      if (activeTutorials.length) {
        setFocusedTutorialIndex(activeTutorials.length - 1);
      } else {
        setFocusedTutorialIndex(null);
      }
    }
  }, [activeTutorials]);

  useEffect(() => {
    if (!isExpanded && focusedTutorialIndex !== null) {
      setFocusedTutorialIndex(null);
    }
  }, [isExpanded, focusedTutorialIndex]);

  if (!activeTutorials.length) return null;

  const header = (
    <div
      className={`flex flex-row justify-between bg-lightBlue text-black font-bold text-xl px-2 py-1 ${
        isExpanded ? "cursor-move" : ""
      }`}
    >
      <span>
        Tutorial{" "}
        <Kbd className="font-normal text-base">
          {settings.keyboardShortcuts[ControlCode.FocusTutorials][0]}
        </Kbd>
      </span>
      <Tippy
        content={`${isExpanded ? "Minimize" : "Expand"} (${
          settings.keyboardShortcuts[ControlCode.ToggleTutorials][0]
        })`}
      >
        <button
          className="w-6 h-6"
          type="button"
          onClick={noFocusOnClick(() => {
            if (isExpanded) {
              minimize();
            } else {
              expand();
            }
          })}
        >
          {isExpanded ? <Icons.Minimize /> : <Icons.Expand />}
        </button>
      </Tippy>
    </div>
  );

  const content = (
    <div className="whitespace-pre-wrap">
      {isSomeTutorialFocused && (
        <div className="p-2 border-b border-gray">
          Tutorial Keyboard Controls
          <div className="text-sm mb-1">
            <div>
              <Kbd noPad>
                {settings.keyboardShortcuts[ControlCode.FocusTutorials][0]}
              </Kbd>{" "}
              to focus/unfocus tutorial interface
            </div>
            <div>
              <Kbd noPad>
                {settings.keyboardShortcuts[ControlCode.ToggleTutorials][0]}
              </Kbd>{" "}
              to toggle tutorial interface
            </div>
            <div>
              <Kbd noPad>up</Kbd>/<Kbd noPad>down</Kbd> to change selected
              tutorial
            </div>
            <div>
              <Kbd noPad>left</Kbd>/<Kbd noPad>right</Kbd> to view different
              steps in tutorial
            </div>
            <div>
              <Kbd noPad>space</Kbd> to complete current step, if available
            </div>
            <div>
              <Kbd noPad>backspace</Kbd> to dismiss the selected tutorial
            </div>
          </div>
        </div>
      )}
      {activeTutorials.map((t, i) => (
        <Tutorial
          key={t.id}
          tutorialId={t.id}
          stepIndex={t.step}
          isLast={i === activeTutorials.length - 1}
          isFocused={i === focusedTutorialIndex}
        />
      ))}
    </div>
  );

  if (isExpanded) {
    return (
      <div className="fixed pointer-events-none w-screen h-screen top-0 left-0">
        <Draggable>
          <div className="border-2 border-lightBlue w-96 mx-auto mt-8 bg-black pointer-events-auto opacity-90">
            {header}
            {content}
          </div>
        </Draggable>
      </div>
    );
  } else {
    return (
      <div>
        {header}
        <div className="hidden">{content}</div>
      </div>
    );
  }
}

const tutorialRichTextFormatters = {
  entity: ([templateName]: string[]) => (
    <EntityPreview templateName={templateName as TemplateName} />
  ),
  kbd: (text: string) => <Kbd>{text}</Kbd>,
  b: (text: string) => <b className="font-bold text-lighterBlue">{text}</b>,
  br: () => <div className="h-2" />,
};

function Tutorial({
  tutorialId,
  stepIndex,
  isLast,
  isFocused,
}: {
  tutorialId: TutorialId;
  stepIndex: number;
  isLast?: boolean;
  isFocused?: boolean;
}) {
  const { formatMessage } = useIntl();
  const dispatch = useDispatch();
  const tutorial = tutorials[tutorialId];
  const step = tutorial.steps[stepIndex];
  const [selectedStepIndex, setSelectedStepIndex] = useState(stepIndex);
  const selectedStep = tutorial.steps[selectedStepIndex];
  useEffect(() => setSelectedStepIndex(stepIndex), [stepIndex]);

  useControl({
    code: ControlCode.Left,
    callback: () => setSelectedStepIndex(selectedStepIndex - 1),
    group: HotkeyGroup.Tutorial,
    disabled: !isFocused || selectedStepIndex <= 0,
  });

  useControl({
    code: ControlCode.Right,
    callback: () => setSelectedStepIndex(selectedStepIndex + 1),
    group: HotkeyGroup.Tutorial,
    disabled: !isFocused || selectedStepIndex >= stepIndex,
  });

  useControl({
    code: ControlCode.DismissTutorial,
    callback: () => dispatch(actions.completeTutorial(tutorialId)),
    group: HotkeyGroup.Tutorial,
    disabled: !isFocused,
  });

  useControl({
    code: ControlCode.QuickAction,
    callback: () => dispatch(actions.completeTutorialStep(tutorialId)),
    group: HotkeyGroup.Tutorial,
    disabled: !isFocused || !step.isDismissible,
  });

  return (
    <div
      className={`p-2 ${!isLast && !isFocused ? "border-b border-gray" : ""} ${
        isFocused ? "border border-white" : ""
      }`}
    >
      <div className="flex flex-row justify-between">
        <div className="font-bold">{tutorial.label}</div>
        <div className="flex flex-row">
          <Tippy content="Back">
            <button
              className="w-6 h-6 disabled:text-gray disabled:cursor-not-allowed"
              type="button"
              disabled={selectedStepIndex <= 0}
              onClick={noFocusOnClick(() =>
                setSelectedStepIndex(selectedStepIndex - 1),
              )}
            >
              <Icons.ChevronLeft />
            </button>
          </Tippy>
          {tutorial.steps.indexOf(selectedStep) + 1} / {tutorial.steps.length}
          <Tippy content="Next">
            <button
              className="w-6 h-6 disabled:text-gray disabled:cursor-not-allowed"
              type="button"
              disabled={selectedStepIndex >= stepIndex}
              onClick={noFocusOnClick(() =>
                setSelectedStepIndex(selectedStepIndex + 1),
              )}
            >
              <Icons.ChevronRight />
            </button>
          </Tippy>
          <Tippy content="Dismiss Tutorial">
            <button
              className="w-6 h-6 ml-1"
              type="button"
              onClick={noFocusOnClick(() =>
                dispatch(actions.completeTutorial(tutorialId)),
              )}
            >
              <Icons.X />
            </button>
          </Tippy>
        </div>
      </div>
      {step.elementHighlightSelectors && (
        <ElementHighlighter selectors={step.elementHighlightSelectors} />
      )}
      <div className="text-sm">
        {formatMessage({ id: selectedStep.text }, tutorialRichTextFormatters)}
      </div>
      <div className="flex flex-row-reverse">
        {step.isDismissible && (
          <button
            type="button"
            className="btn"
            onClick={() => dispatch(actions.completeTutorialStep(tutorialId))}
          >
            {stepIndex === tutorial.steps.length - 1 ? "Done" : "Next"}
          </button>
        )}
      </div>
    </div>
  );
}

const HIGHLIGHT = "highlight";
function ElementHighlighter({
  selectors: elementSelectors,
}: {
  selectors: string[];
}) {
  useEffect(() => {
    let highlighted: Element[] = [];
    const callback = () => {
      const matched: Element[] = [];
      elementSelectors.forEach((selector) => {
        const elements = document.querySelectorAll(selector);
        matched.push(...elements);
      });
      highlighted.forEach((el) => {
        if (!matched.includes(el)) {
          el.classList.remove(HIGHLIGHT);
        }
      });
      matched.forEach((el) => {
        if (!highlighted.includes(el)) {
          el.classList.add(HIGHLIGHT);
        }
      });
      highlighted = matched;
    };

    const observer = new MutationObserver(callback);
    observer.observe(document.body, {
      childList: true,
      attributes: true,
      subtree: true,
    });

    callback();

    const cleanup = () => {
      observer.disconnect();
      highlighted.forEach((el) => el.classList.remove(HIGHLIGHT));
    };

    return cleanup;
  }, elementSelectors);
  return null;
}
