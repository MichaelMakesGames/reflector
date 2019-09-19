import React from "react";
import { useSelector } from "react-redux";
import * as selectors from "~/state/selectors";

export default function Status() {
  const gameOver = useSelector(selectors.gameOver);

  return (
    <div className="box status">
      <div className="box__label">Status</div>
      <div>{gameOver ? "Game Over" : "Alive"}</div>
    </div>
  );
}
