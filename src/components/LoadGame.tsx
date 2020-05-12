import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import { useDispatch, useSelector } from "react-redux";
import actions from "~state/actions";
import selectors from "~state/selectors";
import { RawState } from "~types";
import { load } from "~utils/gameSave";

export default function LoadGame() {
  const [oldSave, setOldSave] = useState<null | RawState>(null);
  const dispatch = useDispatch();
  const version = useSelector(selectors.version);
  useEffect(() => {
    load().then((savedGame) => {
      if (!savedGame) {
        dispatch(actions.newGame());
      } else if (selectors.version(savedGame) === version) {
        dispatch(actions.loadGame({ state: savedGame }));
      } else {
        setOldSave(savedGame);
      }
    });
  }, []);

  if (!oldSave) {
    return null;
  }

  return (
    <Modal
      isOpen
      overlayClassName="inset-0 fixed h-screen w-screen bg-opaqueWhite"
      className="w-2/5 h-auto mx-auto my-8 shadow-2xl bg-black p-8 border border-white border-solid rounded"
    >
      <p>
        The saved game is from version {selectors.version(oldSave)}, and may not
        work with the current version, {version}.
      </p>
      <button
        type="button"
        onClick={() => {
          setOldSave(null);
          dispatch(actions.loadGame({ state: oldSave }));
        }}
      >
        Load Anyway
      </button>
      <button
        type="button"
        onClick={() => {
          setOldSave(null);
          dispatch(actions.newGame());
        }}
      >
        New Game
      </button>
    </Modal>
  );
}
