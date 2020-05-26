import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  CANCEL_KEYS,
  DOWN,
  DOWN_KEYS,
  LEFT,
  LEFT_KEYS,
  RIGHT,
  RIGHT_KEYS,
  UP,
  UP_KEYS,
} from "~constants";
import { useShortcuts } from "~hooks";
import actions from "~state/actions";
import selectors from "~state/selectors";
import { Direction } from "~types";
import { getConstDir } from "~utils/geometry";

export default function Laser() {
  const dispatch = useDispatch();
  const isWeaponActive = useSelector(selectors.isWeaponActive);
  const aimingDirection = useSelector(selectors.lastAimingDirection);
  const isAimingInDirection = (d: Direction): boolean =>
    isWeaponActive && getConstDir(d) === getConstDir(aimingDirection);

  const fire = () => dispatch(actions.fireWeapon());
  const cancel = () => dispatch(actions.deactivateWeapon());
  const aimUp = () => dispatch(actions.targetWeapon(UP));
  const aimRight = () => dispatch(actions.targetWeapon(RIGHT));
  const aimDown = () => dispatch(actions.targetWeapon(DOWN));
  const aimLeft = () => dispatch(actions.targetWeapon(LEFT));
  const laserShortcuts = Object.fromEntries<() => void>([
    ...UP_KEYS.map((key): [string, () => void] => [
      `ctrl + ${key}`,
      isAimingInDirection(UP) ? fire : aimUp,
    ]),
    ...RIGHT_KEYS.map((key): [string, () => void] => [
      `ctrl + ${key}`,
      isAimingInDirection(RIGHT) ? fire : aimRight,
    ]),
    ...DOWN_KEYS.map((key): [string, () => void] => [
      `ctrl + ${key}`,
      isAimingInDirection(DOWN) ? fire : aimDown,
    ]),
    ...LEFT_KEYS.map((key): [string, () => void] => [
      `ctrl + ${key}`,
      isAimingInDirection(LEFT) ? fire : aimLeft,
    ]),
    ...CANCEL_KEYS.map((key): [string, () => void] => [key, cancel]),
  ]);
  useShortcuts(laserShortcuts);

  return (
    <section className="p-2 border-b border-gray flex flex-row items-center">
      <h2 className="text-xl flex-grow">Laser</h2>
      <div className="flex flex-row">
        <div className="flex flex-col flex-1">
          <div className="flex-1" />
          <button
            className={`flex-1 ${
              isAimingInDirection(LEFT) ? "text-laser" : ""
            }`}
            type="button"
            onClick={aimLeft}
          >
            ◀
          </button>
          <div className="flex-1" />
        </div>
        <div className="flex flex-col flex-1">
          <button
            className={`flex-1 ${isAimingInDirection(UP) ? "text-laser" : ""}`}
            type="button"
            onClick={aimUp}
          >
            ▲
          </button>
          <div className="flex-1" />
          <button
            className={`flex-1 ${
              isAimingInDirection(DOWN) ? "text-laser" : ""
            }`}
            type="button"
            onClick={aimDown}
          >
            ▼
          </button>
        </div>
        <div className="flex flex-col flex-1">
          <div className="flex-1" />
          <button
            className={`flex-1 ${
              isAimingInDirection(RIGHT) ? "text-laser" : ""
            }`}
            type="button"
            onClick={aimRight}
          >
            ▶
          </button>
          <div className="flex-1" />
        </div>
      </div>
      <button
        className="btn ml-2"
        type="button"
        disabled={!isWeaponActive}
        onClick={(e) => {
          cancel();
          (e.target as HTMLButtonElement).blur();
        }}
      >
        Cancel
      </button>
      <button
        className="btn ml-2"
        type="button"
        disabled={!isWeaponActive}
        onClick={(e) => {
          fire();
          (e.target as HTMLButtonElement).blur();
        }}
      >
        Fire
      </button>
    </section>
  );
}
