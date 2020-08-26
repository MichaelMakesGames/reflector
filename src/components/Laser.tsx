import React, { useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DOWN, LEFT, RIGHT, UP } from "~constants";
import { ControlCode } from "~types/ControlCode";
import { useControl } from "~hooks";
import actions from "~state/actions";
import selectors from "~state/selectors";
import { Direction } from "~types";
import { getConstDir } from "~utils/geometry";
import { SettingsContext } from "~contexts";

export default function Laser() {
  const dispatch = useDispatch();
  const settings = useContext(SettingsContext);
  const isWeaponActive = useSelector(selectors.isWeaponActive);
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

  const makeAimHandler = (direction: Direction) => () => {
    if (settings.aimInSameDirectionToFire && isAimingInDirection(direction)) {
      dispatch(actions.fireWeapon());
    } else {
      dispatch(actions.targetWeapon(direction));
    }
  };
  const modifiers =
    settings.unmodifiedAiming && isWeaponActive
      ? ["", settings.aimingModifierKey]
      : [settings.aimingModifierKey];
  useControl(ControlCode.Up, makeAimHandler(UP), true, modifiers);
  useControl(ControlCode.Down, makeAimHandler(DOWN), true, modifiers);
  useControl(ControlCode.Left, makeAimHandler(LEFT), true, modifiers);
  useControl(ControlCode.Right, makeAimHandler(RIGHT), true, modifiers);

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
            onClick={makeAimHandler(LEFT)}
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
            onClick={makeAimHandler(UP)}
          >
            ▲
          </button>
          <div className="flex-1" />
          <button
            className={`flex-1 font-serif ${
              isAimingInDirection(DOWN) ? "text-red" : ""
            }`}
            type="button"
            onClick={makeAimHandler(DOWN)}
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
            onClick={makeAimHandler(RIGHT)}
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
