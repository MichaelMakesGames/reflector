/* global document */
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { app, getPosFromMouse } from "~/renderer";
import actions from "~state/actions";
import selectors from "~state/selectors";
import { arePositionsEqual } from "~utils/geometry";

export default function GameMap() {
  useEffect(() => {
    const map = document.getElementById("map");
    if (map) {
      map.appendChild(app.view);
    }
  }, []);

  const dispatch = useDispatch();
  const cursorPos = useSelector(selectors.cursorPos);

  return (
    <section>
      {/* eslint-disable-next-line jsx-a11y/mouse-events-have-key-events */}
      <div
        id="map"
        onMouseMove={(e) => {
          const pos = getPosFromMouse(
            e.nativeEvent.offsetX,
            e.nativeEvent.offsetY,
          );
          if (!cursorPos || !arePositionsEqual(cursorPos, pos)) {
            dispatch(actions.setCursorPos(pos));
          }
        }}
        onMouseOut={() => dispatch(actions.setCursorPos(null))}
      />
    </section>
  );
}
