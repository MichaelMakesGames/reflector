import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import renderer from "~renderer";
import actions from "~state/actions";
import selectors from "~state/selectors";
import { RawState } from "~types";
import { ControlCode } from "~types/ControlCode";
import { load } from "~utils/gameSave";
import HotkeyButton from "./HotkeyButton";
import { HotkeyGroup } from "./HotkeysProvider";
import Modal from "./Modal";

export default function LoadGame() {
  const [isLoading, setIsLoading] = useState(true);
  const [oldSave, setOldSave] = useState<null | RawState>(null);
  const dispatch = useDispatch();
  const version = useSelector(selectors.version);
  useEffect(() => {
    renderer
      .getLoadPromise()
      .then(load)
      .then((savedGame) => {
        if (!savedGame) {
          setIsLoading(false);
          dispatch(actions.newGame());
        } else if (
          selectors.version(savedGame) === version &&
          !selectors.version(savedGame).includes("unstable")
        ) {
          setIsLoading(false);
          dispatch(actions.loadGame({ state: savedGame }));
        } else {
          setOldSave(savedGame);
        }
      });
  }, []);

  if (!isLoading) {
    return null;
  }

  return (
    <div className="fixed w-screen h-screen bg-black z-20 text-center text-2xl pt-20">
      Loading...
      {oldSave && (
        <Modal isOpen>
          {selectors.version(oldSave).includes("unstable") ? (
            <>
              <p>
                Your save is from an unstable version of the game. Loading the
                game may not work.
              </p>
              <p>
                <a
                  className="text-lighterBlue underline"
                  href="https://mscottmoore.itch.io/reflector"
                >
                  The stable version is available at itch.io.
                </a>
              </p>
            </>
          ) : (
            <p>
              Your save is from version {selectors.version(oldSave)}, and may
              not work with the current version, {version}.
            </p>
          )}
          <HotkeyButton
            className="mt-3 mr-2"
            label="Load Anyway"
            controlCode={ControlCode.Menu1}
            hotkeyGroup={HotkeyGroup.Loading}
            callback={() => {
              setOldSave(null);
              dispatch(actions.loadGame({ state: oldSave }));
              setIsLoading(false);
            }}
          />
          <HotkeyButton
            className="mt-3 mr-2"
            label="New Game"
            controlCode={ControlCode.Menu2}
            hotkeyGroup={HotkeyGroup.Loading}
            callback={() => {
              setOldSave(null);
              dispatch(actions.newGame());
              setIsLoading(false);
            }}
          />
        </Modal>
      )}
    </div>
  );
}
