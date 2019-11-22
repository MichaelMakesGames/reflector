/* global document */
import Tooltip from "rc-tooltip";
import "rc-tooltip/assets/bootstrap.css";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DOWN, LEFT, PLAYER_ID, RIGHT, UP } from "~/constants";
import * as actions from "~/state/actions";
import * as selectors from "~/state/selectors";
import { Action } from "~/types/Action";
import { Entity, Pos, Description } from "~/types/Entity";
import buildings from "~data/buildings";
import { createEntityFromTemplate } from "~utils/entities";
import { MakeRequired } from "~types";

interface Control {
  display: string;
  triggers: { code: string; shift?: boolean }[];
  action: Action;
  label: string;
  hidden?: boolean;
  tooltip?: string;
}
function getControls(
  activeWeapon: Entity | null,
  playerPosition: Pos,
  placing: MakeRequired<Entity, "placing" | "pos"> | null,
  isBuildMenuOpen: boolean,
  inspector: Entity | null,
): Control[] {
  const upTriggers = [
    { code: "KeyW" },
    { code: "ArrowUp" },
    { code: "Numpad8" },
  ];
  const downTriggers = [
    { code: "KeyS" },
    { code: "ArrowDown" },
    { code: "Numpad2" },
  ];
  const leftTriggers = [
    { code: "KeyA" },
    { code: "ArrowLeft" },
    { code: "Numpad4" },
  ];
  const rightTriggers = [
    { code: "KeyD" },
    { code: "ArrowRight" },
    { code: "Numpad6" },
  ];
  const confirmTriggers = [{ code: "Enter" }, { code: "Space" }];
  const cancelTriggers = [{ code: "Escape" }];

  const movePlayer = [
    {
      display: "w",
      triggers: upTriggers,
      action: actions.move({ entityId: PLAYER_ID, ...UP }),
      label: "Move Up",
    },
    {
      display: "a",
      triggers: leftTriggers,
      action: actions.move({ entityId: PLAYER_ID, ...LEFT }),
      label: "Move Left",
    },
    {
      display: "s",
      triggers: downTriggers,
      action: actions.move({ entityId: PLAYER_ID, ...DOWN }),
      label: "Move Down",
    },
    {
      display: "d",
      triggers: rightTriggers,
      action: actions.move({ entityId: PLAYER_ID, ...RIGHT }),
      label: "Move Right",
    },
  ];
  const activateWeapon: Control[] = [
    {
      display: "Enter",
      triggers: confirmTriggers,
      action: actions.activateWeapon({ slot: 1 }),
      label: "Activate Laser",
      tooltip:
        "Activates your laser. You will get to choose your direction and preview before firing.",
    },
  ];
  const reflectorActions: Control[] = [
    {
      display: "r",
      triggers: [{ code: "KeyR" }],
      action: actions.activatePlacement({
        template: "REFLECTOR_UP_RIGHT",
        takesTurn: false,
        validitySelector: "canPlaceReflector",
      }),
      label: "Manage Reflectors (free action)",
      tooltip:
        "Reflectors are your main tool for manipulating lasers. Placing a reflector does not cost any resources and does not take a turn. However, reflectors can only be placed around you or a projector, and are automatically destroyed if they are ever out of range.",
    },
  ];
  const wait: Control[] = [
    {
      display: ".",
      triggers: [{ code: "Period" }],
      action: actions.playerTookTurn(),
      label: "Wait",
    },
  ];
  const build: Control[] = [
    {
      display: "b",
      triggers: [{ code: "KeyB" }],
      action: actions.openBuildMenu(),
      label: "Build",
    },
  ];
  const mine: Control[] = [
    {
      display: "m",
      triggers: [{ code: "KeyM" }],
      action: actions.mine(),
      label: "Manually Mine",
      tooltip:
        "You can mine by hand if you are next to or on top of ore. You can also build mines which will mine metal automatically.",
    },
  ];
  const inspect: Control[] = [
    {
      display: "q",
      triggers: [{ code: "KeyQ" }],
      action: actions.inspect(),
      label: "Inspect (free action)",
    },
  ];

  if (isBuildMenuOpen) {
    return [
      {
        display: "Escape",
        triggers: cancelTriggers,
        action: actions.closeBuildMenu(),
        label: "Close",
      },
      ...buildings.map(building => ({
        display: building.key,
        triggers: [{ code: `Key${building.key.toUpperCase()}` }],
        action: actions.activatePlacement({
          template: building.template,
          cost: building.cost,
          takesTurn: true,
          validitySelector: building.validitySelector,
        }),
        label: `${building.label} (${building.cost.amount} ${building.cost.resource})`,
        tooltip: (createEntityFromTemplate(building.template)
          .description as Description).description,
      })),
    ];
  }

  if (activeWeapon) {
    return [
      {
        display: "w",
        triggers: upTriggers,
        action: actions.targetWeapon(UP),
        label: "Target Up",
      },
      {
        display: "a",
        triggers: leftTriggers,
        action: actions.targetWeapon(LEFT),
        label: "Target Left",
      },
      {
        display: "s",
        triggers: downTriggers,
        action: actions.targetWeapon(DOWN),
        label: "Target Down",
      },
      {
        display: "d",
        triggers: rightTriggers,
        action: actions.targetWeapon(RIGHT),
        label: "Target Right",
      },
      {
        display: "Enter",
        triggers: confirmTriggers,
        action: actions.fireWeapon(),
        label: "Fire",
      },
      {
        display: "Escape",
        triggers: cancelTriggers,
        action: actions.activateWeapon({
          slot: activeWeapon.weapon ? activeWeapon.weapon.slot : 0,
        }),
        label: "Cancel",
      },
    ];
  }

  if (inspector) {
    return [
      {
        display: "Escape",
        triggers: cancelTriggers,
        action: actions.cancelInspect(),
        label: "Close",
      },
      {
        display: "w",
        triggers: upTriggers,
        action: actions.move({ entityId: inspector.id, ...UP }),
        label: "Move Inspector Up",
      },
      {
        display: "a",
        triggers: leftTriggers,
        action: actions.move({ entityId: inspector.id, ...LEFT }),
        label: "Move Inspector Left",
      },
      {
        display: "s",
        triggers: downTriggers,
        action: actions.move({ entityId: inspector.id, ...DOWN }),
        label: "Move Inspector Down",
      },
      {
        display: "d",
        triggers: rightTriggers,
        action: actions.move({ entityId: inspector.id, ...RIGHT }),
        label: "Move Inspector Right",
      },
    ];
  }

  if (placing) {
    const placingControls: Control[] = [
      {
        display: "w",
        triggers: upTriggers,
        action: actions.movePlacement({ direction: UP, jumpToValid: false }),
        label: "Move Target Up (shift to jump to valid spot)",
      },
      {
        display: "a",
        triggers: leftTriggers,
        action: actions.movePlacement({ direction: LEFT, jumpToValid: false }),
        label: "Move Target Left (shift to jump to valid spot)",
      },
      {
        display: "s",
        triggers: downTriggers,
        action: actions.movePlacement({ direction: DOWN, jumpToValid: false }),
        label: "Move Target Down (shift to jump to valid spot)",
      },
      {
        display: "d",
        triggers: rightTriggers,
        action: actions.movePlacement({ direction: RIGHT, jumpToValid: false }),
        label: "Move Target Right (shift to jump to valid spot)",
      },
      {
        display: "W",
        triggers: upTriggers.map(t => ({ ...t, shift: true })),
        action: actions.movePlacement({ direction: UP, jumpToValid: true }),
        hidden: true,
        label: "Move Target Up",
      },
      {
        display: "A",
        triggers: leftTriggers.map(t => ({ ...t, shift: true })),
        action: actions.movePlacement({ direction: LEFT, jumpToValid: true }),
        hidden: true,
        label: "Move Target Left",
      },
      {
        display: "S",
        triggers: downTriggers.map(t => ({ ...t, shift: true })),
        action: actions.movePlacement({ direction: DOWN, jumpToValid: true }),
        hidden: true,
        label: "Move Target Down",
      },
      {
        display: "D",
        triggers: rightTriggers.map(t => ({ ...t, shift: true })),
        action: actions.movePlacement({ direction: RIGHT, jumpToValid: true }),
        hidden: true,
        label: "Move Target Right",
      },
      {
        display: "r",
        triggers: [{ code: "KeyR" }],
        action: actions.rotatePlacement(),
        label: "Rotate",
      },
      {
        display: "Escape",
        triggers: cancelTriggers,
        action: actions.cancelPlacement(),
        label: "Cancel",
      },
      {
        display: "Enter",
        triggers: confirmTriggers,
        action: actions.finishPlacement({ placeAnother: false }),
        label: "Confirm",
      },
    ];

    if (placing.reflector) {
      placingControls.push({
        display: "Backspace",
        triggers: [{ code: "Backspace" }, { code: "Delete" }],
        action: actions.removeReflector(placing.pos),
        label: "Remove Reflector",
      });
      placingControls.push({
        display: "c",
        triggers: [{ code: "KeyC" }],
        action: actions.clearReflectors(),
        label: "Clear All Reflectors",
      });
      placingControls.push({
        display: "Shift+Enter",
        triggers: confirmTriggers.map(t => ({ ...t, shift: true })),
        action: actions.finishPlacement({ placeAnother: true }),
        label: "Confirm and Place Another",
      });
    }

    return placingControls;
  }

  return [
    ...movePlayer,
    ...activateWeapon,
    ...reflectorActions,
    ...build,
    ...mine,
    ...wait,
    ...inspect,
  ];
}

export default function Controls() {
  const dispatch = useDispatch();
  const activeWeapon = useSelector(selectors.activeWeapon);
  const player = useSelector(selectors.player);
  const placing = useSelector(selectors.placingTarget);
  const gameOver = useSelector(selectors.gameOver);
  const isBuildMenuOpen = useSelector(selectors.isBuildMenuOpen);
  const inspector = useSelector(selectors.inspector);

  const pos = player ? player.pos : { x: 0, y: 0 };
  const controls: Control[] = gameOver
    ? []
    : getControls(activeWeapon, pos, placing, isBuildMenuOpen, inspector);

  function listener(event: KeyboardEvent) {
    if (gameOver) return;
    const { code, shiftKey } = event;
    const triggered = controls.find(control =>
      control.triggers.some(
        trigger => trigger.code === code && Boolean(trigger.shift) === shiftKey,
      ),
    );
    if (triggered) {
      dispatch(triggered.action);
    }
  }

  useEffect(() => {
    document.addEventListener("keydown", listener);
    return () => document.removeEventListener("keydown", listener);
  });

  return (
    <div className="controls box">
      <div className="box__label">Controls</div>
      {controls
        .filter(control => !control.hidden)
        .map(control => (
          <button
            type="button"
            key={control.display}
            className="control"
            onClick={() => dispatch(control.action)}
            onFocus={e => e.target.blur()}
          >
            <kbd>{control.display}</kbd>
            <span>{control.label}</span>
            {control.tooltip && (
              <Tooltip
                overlay={<span>{control.tooltip}</span>}
                placement="top"
                overlayStyle={{ pointerEvents: "none", maxWidth: "20em" }}
              >
                <span className="help">?</span>
              </Tooltip>
            )}
          </button>
        ))}
    </div>
  );
}
