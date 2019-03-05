import React, { useEffect } from "react";
import * as actions from "../actions";
import * as selectors from "../selectors";
import { Action, Entity, Position } from "../types";
import { useDispatch, useMappedState } from "redux-react-hook";
import { PLAYER_ID, UP, LEFT, DOWN, RIGHT } from "../constants";
import { action } from "typesafe-actions";
import { makeReflector, makeSplitter } from "../utils";

function getKeyMap(
  activeWeapon: Entity | null,
  playerPosition: Position,
  throwing: Entity | null
): { [key: string]: Action } {
  const movePlayer = {
    w: actions.move({ entityId: PLAYER_ID, ...UP }),
    a: actions.move({ entityId: PLAYER_ID, ...LEFT }),
    s: actions.move({ entityId: PLAYER_ID, ...DOWN }),
    d: actions.move({ entityId: PLAYER_ID, ...RIGHT }),
    ArrowUp: actions.move({ entityId: PLAYER_ID, ...UP }),
    ArrowLeft: actions.move({ entityId: PLAYER_ID, ...LEFT }),
    ArrowDown: actions.move({ entityId: PLAYER_ID, ...DOWN }),
    ArrowRight: actions.move({ entityId: PLAYER_ID, ...RIGHT })
  };
  const activateWeapon = {
    1: actions.activateWeapon({ slot: 1 }),
    2: actions.activateWeapon({ slot: 2 }),
    3: actions.activateWeapon({ slot: 3 }),
    4: actions.activateWeapon({ slot: 4 })
  };
  const activateThrow = {
    r: actions.activateThrow({
      entity: makeReflector(playerPosition.x, playerPosition.y, "/")
    }),
    t: actions.activateThrow({
      entity: makeSplitter(playerPosition.x, playerPosition.y, "horizontal")
    })
  };
  const wait = {
    ".": actions.playerTookTurn()
  };

  if (activeWeapon) {
    return {
      ...activateWeapon,
      w: actions.targetWeapon(UP),
      a: actions.targetWeapon(LEFT),
      s: actions.targetWeapon(DOWN),
      d: actions.targetWeapon(RIGHT),
      ArrowUp: actions.targetWeapon(UP),
      ArrowLeft: actions.targetWeapon(LEFT),
      ArrowDown: actions.targetWeapon(DOWN),
      ArrowRight: actions.targetWeapon(RIGHT),
      Enter: actions.fireWeapon(),
      Escape: actions.activateWeapon({
        slot: activeWeapon.weapon ? activeWeapon.weapon.slot : 0
      })
    };
  }

  if (throwing && throwing.throwing) {
    return {
      w: actions.move({ entityId: throwing.id, ...UP }),
      a: actions.move({ entityId: throwing.id, ...LEFT }),
      s: actions.move({ entityId: throwing.id, ...DOWN }),
      d: actions.move({ entityId: throwing.id, ...RIGHT }),
      ArrowUp: actions.move({ entityId: throwing.id, ...UP }),
      ArrowLeft: actions.move({ entityId: throwing.id, ...LEFT }),
      ArrowDown: actions.move({ entityId: throwing.id, ...DOWN }),
      ArrowRight: actions.move({ entityId: throwing.id, ...RIGHT }),
      r: actions.rotateThrow(),
      Escape: actions.cancelThrow(),
      Enter: actions.executeThrow()
    };
  }
  return {
    ...movePlayer,
    ...activateWeapon,
    ...activateThrow,
    ...wait
  };
}

export default function Controls() {
  const dispatch = useDispatch();
  const weapons = useMappedState(selectors.weapons);
  const activeWeapon = useMappedState(selectors.activeWeapon);
  const player = useMappedState(selectors.player);
  const throwing = useMappedState(selectors.throwingTarget);

  const position = player && player.position ? player.position : { x: 0, y: 0 };
  const keyMap = getKeyMap(activeWeapon, position, throwing);

  function listener(event: KeyboardEvent) {
    const { key } = event;
    if (keyMap[key]) {
      dispatch(keyMap[key]);
    }
  }

  useEffect(() => {
    document.addEventListener("keydown", listener);
    return () => document.removeEventListener("keydown", listener);
  });

  if (!player) return null;
  const inventory = player.inventory;

  return (
    <div>
      <pre>{JSON.stringify(inventory, undefined, 2)}</pre>
      <ul>
        {weapons.map(entity => (
          <pre key={entity.id}>
            {JSON.stringify(entity.weapon, undefined, 2)}
          </pre>
        ))}
      </ul>
    </div>
  );
}
