import React from "react";
import { useSelector, useDispatch } from "react-redux";
import selectors from "~state/selectors";
import actions from "~state/actions";

export default function Status() {
  const dispatch = useDispatch();
  const time = useSelector(selectors.time);
  const day = useSelector(selectors.day);
  const timeUntilVictory = useSelector(selectors.timeUntilVictory);
  const population = useSelector(selectors.population);
  const housingCapacity = useSelector(selectors.housingCapacity);
  const morale = useSelector(selectors.morale);
  return (
    <section className="p-2 border-b border-gray">
      <div className="flex flex-row justify-between items-start mb-2">
        <div className="flex flex-col">
          <p className="text-xl">
            Day {day + 1}, {time}
          </p>
          <p className="text-lightGray">Victory in {timeUntilVictory}</p>
        </div>
        <button
          className="btn"
          onClick={() => {
            dispatch(actions.playerTookTurn());
          }}
          type="button"
        >
          Wait
        </button>
      </div>
      <div className="flex flex-row">
        <p>
          <span className="text-lightGray">Morale: </span>
          {morale}
        </p>
        <p>
          <span className="text-lightGray ml-3">Population: </span>
          {population}
          <span className="text-lightGray"> / {housingCapacity}</span>
        </p>
      </div>
    </section>
  );
}
