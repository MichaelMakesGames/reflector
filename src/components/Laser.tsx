import Tippy from "@tippyjs/react";
import React, { useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import "tippy.js/dist/tippy.css";
import { HotkeyGroup, useControl } from "~components/HotkeysProvider";
import { DOWN, LEFT, RIGHT, UP } from "~constants";
import { SettingsContext } from "~contexts";
import actions from "~state/actions";
import selectors from "~state/selectors";
import { Direction } from "~types";
import { ControlCode } from "~types/ControlCode";
import { noFocusOnClick } from "~utils/controls";
import { getConstDir } from "~utils/geometry";
import HotkeyButton from "./HotkeyButton";

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
  };
  const cancel = () => dispatch(actions.deactivateWeapon());
  useControl({
    code: ControlCode.Back,
    group: HotkeyGroup.Main,
    callback: cancel,
  });

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

  useControl({
    code: ControlCode.Up,
    group: HotkeyGroup.Main,
    callback: makeAimHandler(UP, settings.aimInSameDirectionToFire),
    [settings.aimingModifierKey]: true,
  });
  useControl({
    code: ControlCode.Down,
    group: HotkeyGroup.Main,
    callback: makeAimHandler(DOWN, settings.aimInSameDirectionToFire),
    [settings.aimingModifierKey]: true,
  });
  useControl({
    code: ControlCode.Left,
    group: HotkeyGroup.Main,
    callback: makeAimHandler(LEFT, settings.aimInSameDirectionToFire),
    [settings.aimingModifierKey]: true,
  });
  useControl({
    code: ControlCode.Right,
    group: HotkeyGroup.Main,
    callback: makeAimHandler(RIGHT, settings.aimInSameDirectionToFire),
    [settings.aimingModifierKey]: true,
  });

  useControl({
    code: ControlCode.Up,
    group: HotkeyGroup.Main,
    callback: makeAimHandler(UP, settings.aimInSameDirectionToFire),
    disabled: !(settings.unmodifiedAiming && isWeaponActive),
  });
  useControl({
    code: ControlCode.Down,
    group: HotkeyGroup.Main,
    callback: makeAimHandler(DOWN, settings.aimInSameDirectionToFire),
    disabled: !(settings.unmodifiedAiming && isWeaponActive),
  });
  useControl({
    code: ControlCode.Left,
    group: HotkeyGroup.Main,
    callback: makeAimHandler(LEFT, settings.aimInSameDirectionToFire),
    disabled: !(settings.unmodifiedAiming && isWeaponActive),
  });
  useControl({
    code: ControlCode.Right,
    group: HotkeyGroup.Main,
    callback: makeAimHandler(RIGHT, settings.aimInSameDirectionToFire),
    disabled: !(settings.unmodifiedAiming && isWeaponActive),
  });

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
      <section
        className="p-2 border-b border-gray flex flex-row items-center"
        data-section="LASER"
      >
        <div className="mr-2 flex-grow flex-col" data-status="LASER">
          <div className="text-lightGray">Laser: </div>
          <div>
            {laserState === "READY" && "Ready"}
            {laserState === "RECHARGING" && "Recharging"}
            {laserState === "ACTIVE" && "Aiming"}
          </div>
        </div>

        <div className="flex flex-row" id="AIMING_ARROWS">
          <div className="flex flex-col flex-1">
            <div className="flex-1" />
            <button
              className={`flex-1 font-serif ${
                !["READY", "ACTIVE"].includes(laserState)
                  ? "text-lightGray cursor-not-allowed"
                  : ""
              } ${isAimingInDirection(LEFT) ? "text-red" : ""}`}
              type="button"
              onClick={noFocusOnClick(
                makeAimHandler(LEFT, settings.aimInSameDirectionToFire),
              )}
            >
              ◀
            </button>
            <div className="flex-1" />
          </div>
          <div className="flex flex-col flex-1">
            <button
              className={`flex-1 font-serif ${
                !["READY", "ACTIVE"].includes(laserState)
                  ? "text-lightGray cursor-not-allowed"
                  : ""
              } ${isAimingInDirection(UP) ? "text-red" : ""}`}
              type="button"
              onClick={noFocusOnClick(
                makeAimHandler(UP, settings.aimInSameDirectionToFire),
              )}
            >
              ▲
            </button>
            <div className="flex-1" />
            <button
              className={`flex-1 font-serif ${
                !["READY", "ACTIVE"].includes(laserState)
                  ? "text-lightGray cursor-not-allowed"
                  : ""
              } ${isAimingInDirection(DOWN) ? "text-red" : ""}`}
              type="button"
              onClick={noFocusOnClick(
                makeAimHandler(DOWN, settings.aimInSameDirectionToFire),
              )}
            >
              ▼
            </button>
          </div>
          <div className="flex flex-col flex-1">
            <div className="flex-1" />
            <button
              className={`flex-1 font-serif ${
                !["READY", "ACTIVE"].includes(laserState)
                  ? "text-lightGray cursor-not-allowed"
                  : ""
              } ${isAimingInDirection(RIGHT) ? "text-red" : ""}`}
              type="button"
              onClick={noFocusOnClick(
                makeAimHandler(RIGHT, settings.aimInSameDirectionToFire),
              )}
            >
              ▶
            </button>
            <div className="flex-1" />
          </div>
        </div>

        <div className="flex-column ml-2">
          <HotkeyButton
            label={laserState === "ACTIVE" ? "Fire" : "Activate"}
            className="text-sm mb-1 block text-left"
            style={{ width: "5.625rem" }}
            disabled={!["READY", "ACTIVE"].includes(laserState)}
            disabledIsCosmeticOnly
            controlCode={ControlCode.Fire}
            hotkeyGroup={HotkeyGroup.Main}
            callback={() => {
              if (laserState === "ACTIVE") {
                fire();
              } else {
                dispatch(actions.targetWeapon(aimingDirection));
              }
            }}
          />
          <HotkeyButton
            label="Cancel"
            className="text-sm block text-left"
            style={{ width: "5.625rem" }}
            disabled={!isWeaponActive}
            controlCode={ControlCode.Back}
            hotkeyGroup={HotkeyGroup.Main}
            callback={cancel}
          />
        </div>
      </section>
    </Tippy>
  );
}
