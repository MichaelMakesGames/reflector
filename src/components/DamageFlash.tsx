import React, { useState, useEffect } from "react";
import { useMappedState } from "redux-react-hook";
import * as selectors from "../state/selectors";
import { BRIGHT_RED } from "../constants";

export default function DamageFlash() {
  const player = useMappedState(selectors.player);
  const hp = player && player.hitPoints ? player.hitPoints.current : 0;
  const [prevHp, setPrevHp] = useState(0);

  const ms = 75;
  const style: React.CSSProperties = {
    position: "fixed",
    width: "100vw",
    height: "100vh",
    background: BRIGHT_RED,
    transition: `all ${ms}ms ease-out`,
    pointerEvents: "none",
    opacity: 0,
  };

  if (hp < prevHp) {
    style.opacity = 1;
  }
  if (hp !== prevHp) {
    setTimeout(() => setPrevHp(hp), ms);
  }

  return <div style={style} />;
}
