import React, { useEffect } from "react";
import * as actions from "../redux/actions";
import * as selectors from "../redux/selectors";
import { Action, Entity } from "../types";
import { useDispatch, useMappedState } from "redux-react-hook";
import { PLAYER_ID } from "../constants";

function getKeyMap(activeWeapon: Entity | null): { [key: string]: Action } {
  const base = {
    w: actions.move({ entityId: PLAYER_ID, dx: 0, dy: -1 }),
    a: actions.move({ entityId: PLAYER_ID, dx: -1, dy: 0 }),
    s: actions.move({ entityId: PLAYER_ID, dx: 0, dy: 1 }),
    d: actions.move({ entityId: PLAYER_ID, dx: 1, dy: 0 }),
    ArrowUp: actions.move({ entityId: PLAYER_ID, dx: 0, dy: -1 }),
    ArrowLeft: actions.move({ entityId: PLAYER_ID, dx: -1, dy: 0 }),
    ArrowDown: actions.move({ entityId: PLAYER_ID, dx: 0, dy: 1 }),
    ArrowRight: actions.move({ entityId: PLAYER_ID, dx: 1, dy: 0 }),
    1: actions.activateWeapon({ slot: 1 }),
    2: actions.activateWeapon({ slot: 2 }),
    3: actions.activateWeapon({ slot: 3 }),
    4: actions.activateWeapon({ slot: 4 })
  };
  if (activeWeapon) {
    return {
      ...base,
      w: actions.targetWeapon({ dx: 0, dy: -1 }),
      a: actions.targetWeapon({ dx: -1, dy: 0 }),
      s: actions.targetWeapon({ dx: 0, dy: 1 }),
      d: actions.targetWeapon({ dx: 1, dy: 0 }),
      ArrowUp: actions.targetWeapon({ dx: 0, dy: -1 }),
      ArrowLeft: actions.targetWeapon({ dx: -1, dy: 0 }),
      ArrowDown: actions.targetWeapon({ dx: 0, dy: 1 }),
      ArrowRight: actions.targetWeapon({ dx: 1, dy: 0 }),
      Enter: actions.fireWeapon()
    };
  }
  return base;
}

export default function Controls() {
  const dispatch = useDispatch();
  const weapons = useMappedState(selectors.weapons);
  const activeWeapon = useMappedState(selectors.activeWeapon);
  const keyMap = getKeyMap(activeWeapon);

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

  return (
    <div>
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
