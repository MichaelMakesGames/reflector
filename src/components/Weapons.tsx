import React from "react";
import * as selectors from "../selectors";
import { useMappedState } from "redux-react-hook";
import Weapon from "./Weapon";
export default function Weapons() {
  const weapons = useMappedState(selectors.weapons);

  const getSlot = (slot: number) =>
    weapons.map(w => w.weapon).find(w => Boolean(w && w.slot === slot)) || null;

  const equipping = weapons.find(w => !!w.equipping);
  return (
    <div>
      <Weapon
        label="Equipping"
        weapon={equipping && equipping.weapon ? equipping.weapon : null}
      />
      <Weapon label="Weapon 1" weapon={getSlot(1)} />
      <Weapon label="Weapon 2" weapon={getSlot(2)} />
      <Weapon label="Weapon 3" weapon={getSlot(3)} />
      <Weapon label="Weapon 4" weapon={getSlot(4)} />
    </div>
  );
}
