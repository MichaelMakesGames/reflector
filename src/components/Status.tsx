import Tippy from "@tippyjs/react";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { MINUTES_PER_TURN, COLONISTS_PER_IMMIGRATION_WAVE } from "~constants";
import actions from "~state/actions";
import selectors from "~state/selectors";

export default function Status() {
  const dispatch = useDispatch();
  const time = useSelector(selectors.time);
  const day = useSelector(selectors.day);
  const timeUntilVictory = useSelector(selectors.timeUntilVictory);
  const turnsUntilVictory = useSelector(selectors.turnsUntilVictory);
  const victory = useSelector(selectors.victory);
  const population = useSelector(selectors.population);
  const housingCapacity = useSelector(selectors.housingCapacity);
  const morale = useSelector(selectors.morale);
  return (
    <section className="p-2 border-b border-gray">
      <div className="flex flex-row justify-between items-start mb-2">
        <div className="flex flex-col">
          <Tippy
            content={
              <>
                <p className="mb-2">This is the current time.</p>
                <p className="mb-2">
                  Each turn is {MINUTES_PER_TURN} minutes. Moving, building,
                  shooting, and waiting all take a turn. Everything else happens
                  instantly.
                </p>
                <p className="mb-2">
                  During the day (8:00am - 8:00pm), colonists go to work to
                  produce various resources.
                </p>
                <p className="mb-2">
                  At night, colonists go home and enemies attack.
                </p>
                <p className="mb-2">
                  Each morning, {COLONISTS_PER_IMMIGRATION_WAVE} new colonists
                  will arrive.
                </p>
                <p>Survive 10 days to win!</p>
              </>
            }
          >
            <p className="text-xl">
              Day {day + 1}, {time}
            </p>
          </Tippy>
          <Tippy
            content={`Survive ${turnsUntilVictory} more ${
              turnsUntilVictory === 1 ? "turn" : "turns"
            } without the player dying or morale reaching 0 to win!`}
          >
            <p className="text-lightGray">
              {victory ? "Victory!" : `Victory in ${timeUntilVictory}`}
            </p>
          </Tippy>
        </div>
        <Tippy
          placement="right"
          content="Pass your turn without doing anything."
        >
          <button
            className="btn"
            onClick={() => {
              dispatch(actions.playerTookTurn());
            }}
            type="button"
          >
            Wait
          </button>
        </Tippy>
      </div>
      <div className="flex flex-row">
        <Tippy content="This represents the confidence and discipline of your colony. You lose morale every time a colonist dies, or if you don't have enough food at night. If you ever reach 0 morale, you lose!">
          <p>
            <span className="text-lightGray">Morale: </span>
            {morale}
          </p>
        </Tippy>
        <Tippy content="This is your current population / your housing capacity. At night, colonists will return to their residences. If you don't have enough, they will build temporary tents wherever they are.">
          <p>
            <span className="text-lightGray ml-3">Population: </span>
            {population}
            <span className="text-lightGray"> / {housingCapacity}</span>
          </p>
        </Tippy>
      </div>
    </section>
  );
}
