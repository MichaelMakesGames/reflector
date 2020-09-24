/* global document */
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
import Kbd from "./Kbd";

export default function Laser() {
  const dispatch = useDispatch();
  const settings = useContext(SettingsContext);
  const isWeaponActive = useSelector(selectors.isWeaponActive);
  const laserState = useSelector(selectors.laserState);
  const aimingDirection = useSelector(selectors.lastAimingDirection);
  const isAimingInDirection = (d: Direction): boolean =>
    isWeaponActive && getConstDir(d) === getConstDir(aimingDirection);

  const fire = () => {
    dispatch(actions.fireWeapon());
    if (document.activeElement && (document.activeElement as any).blur) {
      (document.activeElement as any).blur();
    }
  };
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
      fire();
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
                Your laser is ready to fire. Click the Activate button to
                activate your laser, then use the arrows or wasd keys to aim,
                then click the Fire button.
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
        <div className="mr-2 flex-grow flex-col">
          <div className="text-lightGray">Laser: </div>
          <div>
            {laserState === "READY" && "Ready"}
            {laserState === "RECHARGING" && "Recharging"}
            {laserState === "ACTIVE" && "Aiming"}
          </div>
        </div>

        <div className="flex flex-row">
          <div className="flex flex-col flex-1">
            <div className="flex-1" />
            <button
              disabled={!["READY", "ACTIVE"].includes(laserState)}
              className={`flex-1 font-serif disabled:text-lightGray disabled:cursor-not-allowed ${
                isAimingInDirection(LEFT) ? "text-red" : ""
              }`}
              type="button"
              onClick={makeAimHandler(LEFT, settings.aimInSameDirectionToFire)}
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
              onClick={makeAimHandler(UP, settings.aimInSameDirectionToFire)}
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
              onClick={makeAimHandler(DOWN, settings.aimInSameDirectionToFire)}
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
              onClick={makeAimHandler(RIGHT, settings.aimInSameDirectionToFire)}
            >
              ▶
            </button>
            <div className="flex-1" />
          </div>
        </div>

        <div className="flex-column ml-2">
          <button
            className="btn text-sm mb-1 block text-left pl-1"
            style={{ width: "5.5rem" }}
            type="button"
            disabled={!["READY", "ACTIVE"].includes(laserState)}
            onClick={(e) => {
              if (laserState === "READY") {
                dispatch(actions.targetWeapon(aimingDirection));
              } else {
                fire();
              }
              (e.target as HTMLButtonElement).blur();
            }}
          >
            <Kbd>{settings.keyboardShortcuts[ControlCode.Fire][0]}</Kbd>
            <span className="ml-1">
              {laserState === "ACTIVE" ? "Fire" : "Activate"}
            </span>
          </button>
          <button
            className="btn text-sm block text-left pl-1"
            style={{ width: "5.5rem" }}
            type="button"
            disabled={!isWeaponActive}
            onClick={(e) => {
              cancel();
              (e.target as HTMLButtonElement).blur();
            }}
          >
            <Kbd>{settings.keyboardShortcuts[ControlCode.Back][0]}</Kbd>
            <span className="ml-1">Cancel</span>
          </button>
        </div>
      </section>
    </Tippy>
  );
}
