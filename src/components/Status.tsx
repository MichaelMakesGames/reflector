import React from "react";
import { useSelector } from "react-redux";
import * as selectors from "~/state/selectors";

export default function Status() {
  const gameOver = useSelector(selectors.gameOver);
  const population = useSelector(selectors.population);
  const turnsUntilNextImmigrant = useSelector(
    selectors.turnsUntilNextImmigrant,
  );

  return (
    <div className="box status">
      <div className="box__label">Status</div>
      <div>Player: {gameOver ? "Dead" : "Alive"}</div>
      <div>Population: {population}</div>
      <div>Next Arrival: {turnsUntilNextImmigrant}</div>
    </div>
  );
}
