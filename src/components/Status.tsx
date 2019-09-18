import React from "react";
import { useSelector } from "react-redux";
import * as selectors from "~/state/selectors";

export default function Status() {
  const player = useSelector(selectors.player);
  if (!player) return null;
  const { inventory } = player;
  const hp = player.hitPoints;

  return (
    <div className="box status">
      <div className="box__label">Status</div>
      <div>
        Health: {hp.current} / {hp.max}
      </div>
      <div>
        Reflectors:
        {inventory.reflectors}
      </div>
      <div>
        Splitters:
        {inventory.splitters}
      </div>
    </div>
  );
}
