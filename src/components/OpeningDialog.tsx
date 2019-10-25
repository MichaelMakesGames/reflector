import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as actions from "~state/actions";
import * as selectors from "~state/selectors";
import { GameState } from "~types";
import { load } from "~utils/gameSave";

interface Props {
  onClose: () => void;
}

export default function OpeningDialog({ onClose }: Props) {
  const [savedGame, setSavedGame] = useState<null | GameState>(null);
  const dispatch = useDispatch();
  const version = useSelector(selectors.version);

  useEffect(() => {
    load().then(gameState => {
      if (gameState) setSavedGame(gameState);
    });
  });

  return (
    <div className="opening-dialog">
      <h2 className="opening-dialog__header">Reflector: Laser Defense</h2>
      <div className="opening-dialog__about">
        <p>In Reflector, you shoot lasers and kill bugs.</p>
      </div>
      <button
        className="opening-dialog__action"
        type="button"
        onClick={() => {
          dispatch(actions.newGame());
          onClose();
        }}
      >
        New Game
      </button>
      {savedGame && (
        <button
          className="opening-dialog__action"
          type="button"
          onClick={() => {
            dispatch(actions.loadGame({ state: savedGame }));
            onClose();
          }}
        >
          Load Game
        </button>
      )}
      {savedGame && selectors.version(savedGame) !== version && (
        <span className="opening-dialog__warning">
          Warning: saved game version ({selectors.version(savedGame)}) does not
          match current version ({version}). The save might not load correctly.
        </span>
      )}
    </div>
  );
}
