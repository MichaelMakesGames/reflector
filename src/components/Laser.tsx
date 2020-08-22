import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { DOWN, LEFT, RIGHT, UP } from "~constants";
import { ControlCode } from "~data/controls";
import { useControl } from "~hooks";
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
  useControl(ControlCode.AimUp, aimUp);
  useControl(ControlCode.AimDown, aimDown);
  useControl(ControlCode.AimLeft, aimLeft);
  useControl(ControlCode.AimRight, aimRight);
  useControl(ControlCode.Back, cancel);
  useControl(ControlCode.Fire, fire, isWeaponActive);

  return (
    <section className="p-2 border-b border-gray flex flex-row items-center">
      <h2 className="text-xl flex-grow">Laser</h2>
      <div className="flex flex-row">
        <div className="flex flex-col flex-1">
          <div className="flex-1" />
          <button
            className={`flex-1 font-serif ${
              isAimingInDirection(LEFT) ? "text-red" : ""
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
            className={`flex-1 font-serif ${
              isAimingInDirection(UP) ? "text-red" : ""
            }`}
            type="button"
            onClick={aimUp}
          >
            ▲
          </button>
          <div className="flex-1" />
          <button
            className={`flex-1 font-serif ${
              isAimingInDirection(DOWN) ? "text-red" : ""
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
            className={`flex-1 font-serif ${
              isAimingInDirection(RIGHT) ? "text-red" : ""
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
