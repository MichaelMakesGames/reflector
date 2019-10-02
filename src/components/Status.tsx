import React from "react";
import { useSelector } from "react-redux";
import * as selectors from "~/state/selectors";

export default function Status() {
  const gameOver = useSelector(selectors.gameOver);
  const victory = useSelector(selectors.victory);
  const population = useSelector(selectors.population);
  const turnsUntilNextImmigrant = useSelector(
    selectors.turnsUntilNextImmigrant,
  );
  const morale = useSelector(selectors.morale);
  const turnsUntilNextWave = useSelector(selectors.turnsUntilNextWave);

  return (
    <div className="box status">
      <div className="box__label">Status</div>
      {gameOver && !victory && <div>YOU LOSE!</div>}
      {gameOver && victory && <div>VICTORY!</div>}
      <div>Population: {population}</div>
      <div>Next Arrival: {turnsUntilNextImmigrant}</div>
      <div>Morale: {morale}</div>
      <div>Next Wave: {turnsUntilNextWave}</div>
    </div>
  );
}
