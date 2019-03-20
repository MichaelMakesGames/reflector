import React from "react";
import * as selectors from "../state/selectors";
import { useMappedState } from "redux-react-hook";
import Weapon from "./Weapon";
import { BLACK } from "../constants";
export default function Weapons() {
  const weapons = useMappedState(selectors.weapons);

  const getSlot = (slot: number) =>
    weapons.map(w => w.weapon).find(w => Boolean(w && w.slot === slot)) || null;

  const equipping = weapons.find(w => !!w.equipping);
  return (
    <div>
      <div
        style={{
          position: "fixed",
          width: "20em",
          left: "50%",
          top: "20vh",
          background: BLACK,
          transform: "translateX(-50%)",
          zIndex: 10,
        }}
        hidden={!equipping || !equipping.weapon}
      >
        <Weapon
          slot=""
          weapon={equipping && equipping.weapon ? equipping.weapon : null}
        />
      </div>
      <Weapon slot="1" weapon={getSlot(1)} />
      <Weapon slot="2" weapon={getSlot(2)} />
      <Weapon slot="3" weapon={getSlot(3)} />
      <Weapon slot="4" weapon={getSlot(4)} />
    </div>
  );
}
