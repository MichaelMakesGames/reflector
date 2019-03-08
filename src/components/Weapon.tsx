import React from "react";
import { Weapon } from "../types";

export default function Weapon({
  slot,
  weapon,
}: {
  slot: string;
  weapon: Weapon | null;
}) {
  if (!weapon) {
    return (
      <div className="box weapon">
        <div className="box__label weapon__label">{slot}: None</div>
      </div>
    );
  }
  let status = "READY";
  if (weapon.active) status = "TARGETING";
  if (weapon.readyIn) status = `CHARGING (${weapon.readyIn})`;

  return (
    <div className="box weapon">
      <div className="box__label weapon__label">
        {slot}: {weapon.name}
      </div>
      <div>Type: {weapon.type}</div>
      <div>Status: {status}</div>
      <div>Power: {weapon.power}</div>
      <div>Cooldown: {weapon.cooldown}</div>
    </div>
  );
}
