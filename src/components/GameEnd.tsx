import React from "react";
import { useSelector, useDispatch } from "react-redux";
import selectors from "~state/selectors";
import actions from "~state/actions";

export default function GameEnd() {
  const player = useSelector(selectors.player);
  const population = useSelector(selectors.population);
  const morale = useSelector(selectors.morale);
  const gameOver = useSelector(selectors.gameOver);
  const victory = useSelector(selectors.victory);
  const dispatch = useDispatch();

  if (!gameOver) return null;

  return (
    <div className="game-over-dialog box">
      <div className="box__label">{victory ? "Victory!" : "Defeat"}</div>
      {!player && <p>You have died.</p>}
      {morale <= 0 && (
        <p>
          Your colony&apos;s morale reached 0. Every time a colonist dies you
          lose morale.
        </p>
      )}
      {population <= 0 && (
        <p>Your population reached 0. Defend your colonists!</p>
      )}
      <button type="button" onClick={() => dispatch(actions.newGame())}>
        Restart
      </button>
    </div>
  );
}
