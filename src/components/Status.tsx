import React from "react";
import { useMappedState } from "redux-react-hook";
import * as selectors from "../state/selectors";

export default function Status() {
  const player = useMappedState(selectors.player);
  if (!player) return null;
  const inventory = player.inventory;
  if (!inventory) return null;
  const hp = player.hitPoints;
  if (!hp) return null;

  return (
    <div className="box status">
      <div className="box__label">Status</div>
      <div>
        Health: {hp.current} / {hp.max}
      </div>
      <div>Reflectors: {inventory.reflectors}</div>
      <div>Splitters: {inventory.splitters}</div>
    </div>
  );
}
