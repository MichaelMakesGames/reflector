import React from "react";
import { Weapon } from "../types";

export default function Weapon({
  label,
  weapon
}: {
  label: string;
  weapon: Weapon | null;
}) {
  if (!weapon) {
    return (
      <div className="box weapon">
        <div className="box__label weapon__label">{label}</div>
        <div>None</div>
      </div>
    );
  }
  let status = "READY";
  if (weapon.active) status = "TARGETING";
  if (weapon.readyIn) status = `CHARGING (${weapon.readyIn})`;

  return (
    <div className="box weapon">
      <div className="box__label weapon__label">{label}</div>
      <div>Type: {weapon.type}</div>
      <div>Status: {status}</div>
      <div>Power: {weapon.power}</div>
      <div>Cooldown: {weapon.cooldown}</div>
    </div>
  );
}
