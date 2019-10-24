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

interface Control {
  key: string;
  action: Action;
  label: string;
  hidden?: boolean;
  tooltip?: string;
}
function getControls(
  activeWeapon: Entity | null,
  playerPosition: Pos,
  placing: Entity | null,
  isBuildMenuOpen: boolean,
  inspector: Entity | null,
): Control[] {
  const movePlayer = [
    {
      key: "w",
      action: actions.move({ entityId: PLAYER_ID, ...UP }),
      label: "Move Up",
    },
    {
      key: "a",
      action: actions.move({ entityId: PLAYER_ID, ...LEFT }),
      label: "Move Left",
    },
    {
      key: "s",
      action: actions.move({ entityId: PLAYER_ID, ...DOWN }),
      label: "Move Down",
    },
    {
      key: "d",
      action: actions.move({ entityId: PLAYER_ID, ...RIGHT }),
      label: "Move Right",
    },
    {
      key: "ArrowUp",
      action: actions.move({ entityId: PLAYER_ID, ...UP }),
      label: "Move Up",
      hidden: true,
    },
    {
      key: "ArrowLeft",
      action: actions.move({ entityId: PLAYER_ID, ...LEFT }),
      label: "Move Left",
      hidden: true,
    },
    {
      key: "ArrowDown",
      action: actions.move({ entityId: PLAYER_ID, ...DOWN }),
      label: "Move Down",
      hidden: true,
    },
    {
      key: "ArrowRight",
      action: actions.move({ entityId: PLAYER_ID, ...RIGHT }),
      label: "Move Right",
      hidden: true,
    },
  ];
  const activateWeapon = [
    {
      key: "Enter",
      action: actions.activateWeapon({ slot: 1 }),
      label: "Activate Laser",
      tooltip:
        "Activates your laser. You will get to choose your direction and preview before firing.",
    },
  ];
  const reflectorActions = [
    {
      key: "r",
      action: actions.activatePlacement({
        template: "REFLECTOR_UP_RIGHT",
        takesTurn: false,
      }),
      label: "Place Reflector (free action)",
      tooltip:
        "Reflectors are your main tool for manipulating lasers. Placing a reflector does not cost any resources and does not take a turn. However, reflectors can only be placed around you or a projector, and are automatically destroyed if they are ever out of range.",
    },
    {
      key: "c",
      action: actions.clearReflectors(),
      label: "Clear Reflectors (free action)",
      tooltip: "This removes all reflectors from the map.",
    },
  ];
  const wait = [{ key: ".", action: actions.playerTookTurn(), label: "Wait" }];
  const build = [
    {
      key: "b",
      action: actions.openBuildMenu(),
      label: "Build",
    },
  ];
  const mine = [
    {
      key: "m",
      action: actions.mine(),
      label: "Mine",
    },
  ];
  const inspect = [
    {
      key: "?",
      action: actions.inspect(),
      label: "Inspect (free action)",
    },
  ];

  if (isBuildMenuOpen) {
    return [
      {
        key: "Escape",
        action: actions.closeBuildMenu(),
        label: "Close",
      },
      ...buildings.map(building => ({
        key: building.key,
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
        key: "w",
        action: actions.targetWeapon(UP),
        label: "Target Up",
      },
      {
        key: "a",
        action: actions.targetWeapon(LEFT),
        label: "Target Left",
      },
      {
        key: "s",
        action: actions.targetWeapon(DOWN),
        label: "Target Down",
      },
      {
        key: "d",
        action: actions.targetWeapon(RIGHT),
        label: "Target Right",
      },
      {
        key: "ArrowUp",
        action: actions.targetWeapon(UP),
        label: "Target Up",
        hidden: true,
      },
      {
        key: "ArrowLeft",
        action: actions.targetWeapon(LEFT),
        label: "Target Left",
        hidden: true,
      },
      {
        key: "ArrowDown",
        action: actions.targetWeapon(DOWN),
        label: "Target Down",
        hidden: true,
      },
      {
        key: "ArrowRight",
        action: actions.targetWeapon(RIGHT),
        label: "Target Right",
        hidden: true,
      },
      { key: "Enter", action: actions.fireWeapon(), label: "Fire" },
      {
        key: "Escape",
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
        key: "Escape",
        action: actions.cancelInspect(),
        label: "Close",
      },
      {
        key: "w",
        action: actions.move({ entityId: inspector.id, ...UP }),
        label: "Move Inspector Up",
      },
      {
        key: "a",
        action: actions.move({ entityId: inspector.id, ...LEFT }),
        label: "Move Inspector Left",
      },
      {
        key: "s",
        action: actions.move({ entityId: inspector.id, ...DOWN }),
        label: "Move Inspector Down",
      },
      {
        key: "d",
        action: actions.move({ entityId: inspector.id, ...RIGHT }),
        label: "Move Inspector Right",
      },
      {
        key: "ArrowUp",
        action: actions.move({ entityId: inspector.id, ...UP }),
        label: "Move Inspector Up",
        hidden: true,
      },
      {
        key: "ArrowLeft",
        action: actions.move({ entityId: inspector.id, ...LEFT }),
        label: "Move Inspector Left",
        hidden: true,
      },
      {
        key: "ArrowDown",
        action: actions.move({ entityId: inspector.id, ...DOWN }),
        label: "Move Inspector Down",
        hidden: true,
      },
      {
        key: "ArrowRight",
        action: actions.move({ entityId: inspector.id, ...RIGHT }),
        label: "Move Inspector Right",
        hidden: true,
      },
    ];
  }

  if (placing && placing.placing) {
    return [
      {
        key: "w",
        action: actions.movePlacement({ direction: UP }),
        label: "Move Target Up",
      },
      {
        key: "a",
        action: actions.movePlacement({ direction: LEFT }),
        label: "Move Target Left",
      },
      {
        key: "s",
        action: actions.movePlacement({ direction: DOWN }),
        label: "Move Target Down",
      },
      {
        key: "d",
        action: actions.movePlacement({ direction: RIGHT }),
        label: "Move Target Right",
      },
      {
        key: "ArrowUp",
        action: actions.movePlacement({ direction: UP }),
        label: "Move Target Up",
        hidden: true,
      },
      {
        key: "ArrowLeft",
        action: actions.movePlacement({ direction: LEFT }),
        label: "Move Target Left",
        hidden: true,
      },
      {
        key: "ArrowDown",
        action: actions.movePlacement({ direction: DOWN }),
        label: "Move Target Down",
        hidden: true,
      },
      {
        key: "ArrowRight",
        action: actions.movePlacement({ direction: RIGHT }),
        label: "Move Target Right",
        hidden: true,
      },
      { key: "r", action: actions.rotatePlacement(), label: "Rotate" },
      { key: "Escape", action: actions.cancelPlacement(), label: "Cancel" },
      { key: "Enter", action: actions.finishPlacement(), label: "Confirm" },
    ];
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
  const controls = getControls(
    activeWeapon,
    pos,
    placing,
    isBuildMenuOpen,
    inspector,
  );
  const keyMap: { [key: string]: Action } = controls.reduce(
    (acc, cur) => ({ ...acc, [cur.key]: cur.action }),
    {},
  );

  function listener(event: KeyboardEvent) {
    const { key } = event;
    if (!gameOver && keyMap[key]) {
      dispatch(keyMap[key]);
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
            key={control.key}
            className="control"
            onClick={() => dispatch(control.action)}
            onFocus={e => e.target.blur()}
          >
            <kbd>{control.key}</kbd>
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
