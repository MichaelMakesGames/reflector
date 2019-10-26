import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as actions from "~state/actions";
import * as selectors from "~state/selectors";
import { GameState } from "~types";
import { load } from "~utils/gameSave";
import { VICTORY_POPULATION } from "~constants";

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
        <p>
          In Reflector: Laser Defense, you have been tasked with establishing a
          colony on a hostile planet. You have no army to back you, but you are
          equipped with a state of the art laser weapons system.
        </p>
        <p>
          To win, you need to grow your colony to a population of{" "}
          {VICTORY_POPULATION}. If you die, your entire population dies, or your
          colony&apos;s morale reaches zero, you lose. Every time a colonist
          dies, your morale goes down, so keep them safe!
        </p>
        <p>
          Your laser can shoot through multiple enemies and has unlimited range
          and ammunition, but can only fire in the four cardinal directions. You
          will need to place reflectors and build splitters to manipulate the
          beams and make the most of every shot. Reflectors must be within range
          of you or a projector, and can be placed instantly. Splitters, on the
          other hand, cost resources and time to build but are permanent.
        </p>
        <p>
          To start off, you should probably manually mine enough metal to build
          a mine so you can producing some resources. After that, it&apos;s up
          to you.
        </p>
        <p>Good luck.</p>
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
