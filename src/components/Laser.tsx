import React, { useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import { DOWN, LEFT, RIGHT, UP } from "~constants";
import { SettingsContext } from "~contexts";
import { useControl } from "~hooks";
import actions from "~state/actions";
import selectors from "~state/selectors";
import { Direction } from "~types";
import { ControlCode } from "~types/ControlCode";
import { getConstDir } from "~utils/geometry";

export default function Laser() {
  const dispatch = useDispatch();
  const settings = useContext(SettingsContext);
  const isWeaponActive = useSelector(selectors.isWeaponActive);
  const laserState = useSelector(selectors.laserState);
  const aimingDirection = useSelector(selectors.lastAimingDirection);
  const isAimingInDirection = (d: Direction): boolean =>
    isWeaponActive && getConstDir(d) === getConstDir(aimingDirection);

  const fire = () => dispatch(actions.fireWeapon());
  const cancel = () => dispatch(actions.deactivateWeapon());
  useControl(ControlCode.Back, cancel);
  useControl(ControlCode.Fire, fire, isWeaponActive);
  useControl(
    ControlCode.Fire,
    () => dispatch(actions.targetWeapon(aimingDirection)),
    settings.fireKeyActivatesAiming && !isWeaponActive,
  );

  const makeAimHandler = (
    direction: Direction,
    aimInSameDirectionToFire: boolean,
  ) => () => {
    if (aimInSameDirectionToFire && isAimingInDirection(direction)) {
      dispatch(actions.fireWeapon());
    } else {
      dispatch(actions.targetWeapon(direction));
    }
  };
  const modifiers =
    settings.unmodifiedAiming && isWeaponActive
      ? ["", settings.aimingModifierKey]
      : [settings.aimingModifierKey];
  useControl(
    ControlCode.Up,
    makeAimHandler(UP, settings.aimInSameDirectionToFire),
    true,
    modifiers,
  );
  useControl(
    ControlCode.Down,
    makeAimHandler(DOWN, settings.aimInSameDirectionToFire),
    true,
    modifiers,
  );
  useControl(
    ControlCode.Left,
    makeAimHandler(LEFT, settings.aimInSameDirectionToFire),
    true,
    modifiers,
  );
  useControl(
    ControlCode.Right,
    makeAimHandler(RIGHT, settings.aimInSameDirectionToFire),
    true,
    modifiers,
  );

  return (
    <Tippy
      content={
        <div>
          {(laserState === "READY" || laserState === "ACTIVE") && (
            <>
              <p className="mb-1">
                Your laser is ready to fire. Click one of the arrow buttons to
                aim, and click again to fire.
              </p>
              <p>
                You can also press f to activate your laser, use the arrow keys
                to aim, then press f again to fire. Press q to cancel.
              </p>
            </>
          )}
          {laserState === "RECHARGING" && (
            <p>Your laser is recharging. It will be ready again next turn.</p>
          )}
        </div>
      }
    >
      <section className="p-2 border-b border-gray flex flex-row items-center">
        <div className="mr-2 flex-grow">
          <span className="text-lightGray">Laser: </span>
          {laserState}
        </div>
        {isWeaponActive && (
          <button
            className="btn mr-2 text-sm"
            type="button"
            disabled={!isWeaponActive}
            onClick={(e) => {
              cancel();
              (e.target as HTMLButtonElement).blur();
            }}
          >
            Cancel
          </button>
        )}
        <div className="flex flex-row">
          <div className="flex flex-col flex-1">
            <div className="flex-1" />
            <button
              disabled={!["READY", "ACTIVE"].includes(laserState)}
              className={`flex-1 font-serif disabled:text-lightGray disabled:cursor-not-allowed ${
                isAimingInDirection(LEFT) ? "text-red" : ""
              }`}
              type="button"
              onClick={makeAimHandler(LEFT, true)}
            >
              ◀
            </button>
            <div className="flex-1" />
          </div>
          <div className="flex flex-col flex-1">
            <button
              disabled={!["READY", "ACTIVE"].includes(laserState)}
              className={`flex-1 font-serif disabled:text-lightGray disabled:cursor-not-allowed ${
                isAimingInDirection(UP) ? "text-red" : ""
              }`}
              type="button"
              onClick={makeAimHandler(UP, true)}
            >
              ▲
            </button>
            <div className="flex-1" />
            <button
              disabled={!["READY", "ACTIVE"].includes(laserState)}
              className={`flex-1 font-serif disabled:text-lightGray disabled:cursor-not-allowed ${
                isAimingInDirection(DOWN) ? "text-red" : ""
              }`}
              type="button"
              onClick={makeAimHandler(DOWN, true)}
            >
              ▼
            </button>
          </div>
          <div className="flex flex-col flex-1">
            <div className="flex-1" />
            <button
              disabled={!["READY", "ACTIVE"].includes(laserState)}
              className={`flex-1 font-serif disabled:text-lightGray disabled:cursor-not-allowed ${
                isAimingInDirection(RIGHT) ? "text-red" : ""
              }`}
              type="button"
              onClick={makeAimHandler(RIGHT, true)}
            >
              ▶
            </button>
            <div className="flex-1" />
          </div>
        </div>
      </section>
    </Tippy>
  );
}
