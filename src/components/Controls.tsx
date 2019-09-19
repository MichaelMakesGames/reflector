/* global document */
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as actions from "~/state/actions";
import * as selectors from "~/state/selectors";
import { Entity, Pos } from "~/types/Entity";
import { PLAYER_ID, UP, LEFT, DOWN, RIGHT } from "~/constants";
import { createEntityFromTemplate } from "~/utils/entities";
import { Action } from "~/types/Action";

interface Control {
  key: string;
  action: Action;
  label: string;
  hidden?: boolean;
}
function getControls(
  activeWeapon: Entity | null,
  playerPosition: Pos,
  throwing: Entity | null,
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
      key: "1",
      action: actions.activateWeapon({ slot: 1 }),
      label: "Activate Weapon 1",
    },
    {
      key: "2",
      action: actions.activateWeapon({ slot: 2 }),
      label: "Activate Weapon 2",
    },
    {
      key: "3",
      action: actions.activateWeapon({ slot: 3 }),
      label: "Activate Weapon 3",
    },
    {
      key: "4",
      action: actions.activateWeapon({ slot: 4 }),
      label: "Activate Weapon 4",
    },
  ];
  const activateThrow = [
    {
      key: "r",
      action: actions.activateThrow({
        entity: createEntityFromTemplate("REFLECTOR_UP_RIGHT", {
          pos: playerPosition,
        }),
      }),
      label: "Throw Reflector",
    },
    {
      key: "t",
      action: actions.activateThrow({
        entity: createEntityFromTemplate("SPLITTER_HORIZONTAL", {
          pos: playerPosition,
        }),
      }),
      label: "Throw Splitter",
    },
  ];
  const wait = [{ key: ".", action: actions.playerTookTurn(), label: "Wait" }];

  if (activeWeapon) {
    return [
      ...activateWeapon,
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

  if (throwing && throwing.throwing) {
    return [
      {
        key: "w",
        action: actions.move({ entityId: throwing.id, ...UP }),
        label: "Move Target Up",
      },
      {
        key: "a",
        action: actions.move({ entityId: throwing.id, ...LEFT }),
        label: "Move Target Left",
      },
      {
        key: "s",
        action: actions.move({ entityId: throwing.id, ...DOWN }),
        label: "Move Target Down",
      },
      {
        key: "d",
        action: actions.move({ entityId: throwing.id, ...RIGHT }),
        label: "Move Target Right",
      },
      {
        key: "ArrowUp",
        action: actions.move({ entityId: throwing.id, ...UP }),
        label: "Move Target Up",
        hidden: true,
      },
      {
        key: "ArrowLeft",
        action: actions.move({ entityId: throwing.id, ...LEFT }),
        label: "Move Target Left",
        hidden: true,
      },
      {
        key: "ArrowDown",
        action: actions.move({ entityId: throwing.id, ...DOWN }),
        label: "Move Target Down",
        hidden: true,
      },
      {
        key: "ArrowRight",
        action: actions.move({ entityId: throwing.id, ...RIGHT }),
        label: "Move Target Right",
        hidden: true,
      },
      { key: "r", action: actions.rotateThrow(), label: "Rotate" },
      { key: "Escape", action: actions.cancelThrow(), label: "Cancel" },
      { key: "Enter", action: actions.executeThrow(), label: "Throw" },
    ];
  }

  return [...movePlayer, ...activateWeapon, ...activateThrow, ...wait];
}

export default function Controls() {
  const dispatch = useDispatch();
  const weapons = useSelector(selectors.weapons);
  const activeWeapon = useSelector(selectors.activeWeapon);
  const player = useSelector(selectors.player);
  const throwing = useSelector(selectors.throwingTarget);
  const gameOver = useSelector(selectors.gameOver);

  const pos = player ? player.pos : { x: 0, y: 0 };
  const controls = getControls(activeWeapon, pos, throwing);
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
          <div key={control.key} className="control">
            <kbd>{control.key}</kbd>
            <span>{control.label}</span>
          </div>
        ))}
    </div>
  );
}
