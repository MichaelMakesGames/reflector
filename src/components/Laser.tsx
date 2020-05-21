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
    <section className="p-2 border-b border-gray">
      <h2>Laser</h2>
    </section>
  );
}
