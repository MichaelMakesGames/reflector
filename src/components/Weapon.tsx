import React from "react";
import { Weapon } from "../types/types";
import { RED, YELLOW, PURPLE, BLACK, GREEN } from "../constants";

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

  let weaponTypeColor = RED;
  if (weapon.type === "ELECTRIC") weaponTypeColor = YELLOW;
  if (weapon.type === "TELEPORT") weaponTypeColor = PURPLE;

  let statusStyle = { background: BLACK, color: GREEN };
  if (status.startsWith("CHARGING")) statusStyle.color = RED;
  if (status === "TARGETING") statusStyle = { background: GREEN, color: BLACK };

  const itemStyle: React.CSSProperties = { flex: "0 0 50%" };
  return (
    <div className="box weapon">
      <div className="box__label weapon__label">
        {slot}: {weapon.name}
      </div>
      <div style={{ display: "flex", flexFlow: "row wrap" }}>
        <div style={itemStyle}>
          Status: <span style={statusStyle}>{status}</span>
        </div>
        <div style={itemStyle}>
          Type: <span style={{ color: weaponTypeColor }}>{weapon.type}</span>
        </div>
        <div style={itemStyle}>Power: {weapon.power}</div>
        <div style={itemStyle}>Cooldown: {weapon.cooldown}</div>
      </div>
    </div>
  );
}
