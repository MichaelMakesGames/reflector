import React from "react";
import { useSelector } from "react-redux";
import * as selectors from "~/state/selectors";

export default function Status() {
  const population = useSelector(selectors.population);
  const turnsUntilNextImmigrant = useSelector(
    selectors.turnsUntilNextImmigrant,
  );
  const morale = useSelector(selectors.morale);
  const turnsUntilTimeChange = useSelector(selectors.turnsUntilTimeChange);
  const isNight = useSelector(selectors.isNight);

  return (
    <div className="box status">
      <div className="box__label">Status</div>
      <div>Population: {population}</div>
      <div>Next Arrival: {turnsUntilNextImmigrant}</div>
      <div>Morale: {morale}</div>
      <div>
        Turns until {isNight ? "day" : "night"}: {turnsUntilTimeChange}
      </div>
    </div>
  );
}
