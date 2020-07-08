import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import selectors from "~state/selectors";
import actions from "~state/actions";

export default function GameOver() {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const gameOver = useSelector(selectors.gameOver);
  const victory = useSelector(selectors.victory);
  const player = useSelector(selectors.player);
  const morale = useSelector(selectors.morale);
  useEffect(() => {
    setIsOpen(gameOver);
  }, [gameOver]);

  if (!isOpen) return null;

  return (
    <div className="fixed w-screen h-screen">
      <div className="mx-auto mt-16 w-1/4 bg-black border-gray border p-3">
        <h2 className="text-xl">{victory ? "Victory!" : "Defeat"}</h2>
        {!player && (
          <p>You died. Don&apos;t let an enemy attack your character.</p>
        )}
        {morale <= 0 && (
          <p>
            You ran out of morale. Every time a colonist dies, you lose morale.
          </p>
        )}
        <div className="mt-1">
          <button
            className="btn"
            type="button"
            onClick={() => dispatch(actions.newGame())}
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus
          >
            New Game
          </button>
          {victory && (
            <button
              className="btn ml-2"
              type="button"
              onClick={() => setIsOpen(false)}
            >
              Continue Playing
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
