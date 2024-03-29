import Tippy from "@tippyjs/react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "../GameProvider";
import { VERSION } from "../../constants";
import audio from "../../lib/audio";
import { load } from "../../lib/gameSave";
import renderer from "../../renderer";
import actions from "../../state/actions";
import selectors from "../../state/selectors";
import { RawState } from "../../types";
import { ControlCode } from "../../types/ControlCode";
import { HotkeyGroup, useControl } from "../HotkeysProvider";
import MainTitle from "../MainTitle";
import Menu from "../Menu";
import MenuButton from "../MenuButton";
import { RouterPageProps } from "../Router";
import Warning from "../Warning";

export default function MainMenu({ goBack, navigateTo }: RouterPageProps) {
  const [savedGame, setSavedGame] = useState<null | RawState>(null);
  const dispatch = useDispatch();
  const stateIsEmpty = useSelector(selectors.isEmpty);
  const [isLoadingSavedGame, setIsLoadingSavedGame] = useState(stateIsEmpty);

  const stateTurnOfDay = useSelector(selectors.turnOfDay);
  const stateTurnOfNight = useSelector(selectors.turnOfNight);
  const stateDay = useSelector(selectors.day);
  const stateIsNight = useSelector(selectors.isNight);

  const { saveTurnOfDay, saveTurnOfNight, saveDay, saveIsNight, saveVersion } =
    attemptToGetSaveInfo(savedGame);

  const turnOfDay = stateIsEmpty ? saveTurnOfDay : stateTurnOfDay;
  const turnOfNight = stateIsEmpty ? saveTurnOfNight : stateTurnOfNight;
  const day = stateIsEmpty ? saveDay : stateDay;
  const isNight = stateIsEmpty ? saveIsNight : stateIsNight;

  const codeVersion = VERSION;
  const versionIsMismatched = saveVersion !== codeVersion;
  const isUnstable = codeVersion.includes("unstable");

  useControl({
    code: ControlCode.Menu,
    group: HotkeyGroup.Menu,
    callback: goBack,
  });

  useControl({
    code: ControlCode.Back,
    group: HotkeyGroup.Menu,
    callback: goBack,
  });

  useEffect(() => {
    if (audio.currentMusicName === null) {
      audio.playMusic("night");
    }
  });

  useEffect(() => {
    if (stateIsEmpty) {
      renderer
        .getLoadPromise()
        .then(() => load("save-latest"))
        .then((save) => {
          if (save && Array.isArray(save?.tutorials?.completed)) {
            save.tutorials.completed.forEach((tutorial) =>
              dispatch(actions.completeTutorial(tutorial))
            );
          }
          setSavedGame(save ?? null);
          setIsLoadingSavedGame(false);
        });
    }
  }, []);

  if (isLoadingSavedGame) return null;

  return (
    <Menu>
      <MainTitle />
      {savedGame && stateIsEmpty && (
        <MenuButton
          onClick={() =>
            new Promise((resolve) =>
              setTimeout(() => {
                dispatch(actions.loadGame({ state: savedGame }));
                navigateTo("Game");
              }, 100)
            )
          }
        >
          Continue
        </MenuButton>
      )}
      {!stateIsEmpty && (
        <MenuButton onClick={() => navigateTo("Game")}>Continue</MenuButton>
      )}

      {(savedGame || !stateIsEmpty) && (
        <>
          <div className="text-lightGray text-center">
            {isNight
              ? `Night ${day + 1}, Turn ${turnOfNight + 1}`
              : `Day ${day + 1}, Turn ${turnOfDay + 1}`}
          </div>
          {savedGame && versionIsMismatched && (
            <div className="text-yellow text-sm mt-1">
              <Warning className="bg-yellow" />{" "}
              <Tippy content={saveVersion}>
                <span className="font-bold">Save version</span>
              </Tippy>{" "}
              and{" "}
              <Tippy content={codeVersion}>
                <span className="font-bold">game version</span>
              </Tippy>{" "}
              do not match. New game recommended.
            </div>
          )}
          {isUnstable && (
            <div className="text-yellow text-sm mt-1">
              <Warning className="bg-yellow" />{" "}
              <Tippy content={codeVersion}>
                <span className="font-bold">Unstable version</span>
              </Tippy>
              . Saves might not work.
            </div>
          )}
        </>
      )}

      <MenuButton onClick={() => navigateTo("NewGame")}>New Game</MenuButton>
      <MenuButton onClick={() => navigateTo("Settings")}>Settings</MenuButton>
      <MenuButton onClick={() => navigateTo("Credits")}>Credits</MenuButton>
    </Menu>
  );
}

function attemptToGetSaveInfo(savedGame: RawState | null) {
  let saveTurnOfDay = 0;
  let saveTurnOfNight = 0;
  let saveDay = 0;
  let saveIsNight = false;
  let saveVersion: string = "UNKNOWN";

  try {
    saveTurnOfDay = savedGame ? selectors.turnOfDay(savedGame) : 0;
  } catch {} // eslint-disable-line no-empty
  try {
    saveTurnOfNight = savedGame ? selectors.turnOfNight(savedGame) : 0;
  } catch {} // eslint-disable-line no-empty
  try {
    saveDay = savedGame ? selectors.day(savedGame) : 0;
  } catch {} // eslint-disable-line no-empty
  try {
    saveIsNight = savedGame ? selectors.isNight(savedGame) : false;
  } catch {} // eslint-disable-line no-empty
  try {
    saveVersion = savedGame ? selectors.version(savedGame) : "UNKNOWN";
  } catch {} // eslint-disable-line no-empty

  return { saveTurnOfDay, saveTurnOfNight, saveDay, saveIsNight, saveVersion };
}
