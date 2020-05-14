/* global document */
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { app, getPosFromMouse } from "~/renderer";
import actions from "~state/actions";
import selectors from "~state/selectors";
import { arePositionsEqual } from "~utils/geometry";
import { Pos } from "~types";
import ContextMenu from "./ContextMenu";

export default function GameMap() {
  useEffect(() => {
    const map = document.getElementById("map");
    if (map) {
      map.appendChild(app.view);
    }
  }, []);

  const dispatch = useDispatch();
  const cursorPos = useSelector(selectors.cursorPos);
  const [contextMenuPos, setContextMenuPos] = useState<Pos | null>(null);

  return (
    <section className="relative">
      {/* eslint-disable-next-line jsx-a11y/mouse-events-have-key-events */}
      <div
        id="map"
        onMouseMove={(e) => {
          const pos = getPosFromMouse(
            e.nativeEvent.offsetX,
            e.nativeEvent.offsetY,
          );
          if (
            !cursorPos ||
            (!arePositionsEqual(cursorPos, pos) && !contextMenuPos)
          ) {
            dispatch(actions.setCursorPos(pos));
          }
        }}
        onMouseOut={() => {
          if (!contextMenuPos) {
            dispatch(actions.setCursorPos(null));
          }
        }}
        onContextMenu={(e) => {
          e.preventDefault();
          const mousePos = {
            x: e.nativeEvent.offsetX,
            y: e.nativeEvent.offsetY,
          };
          const gamePos = getPosFromMouse(mousePos.x, mousePos.y);
          if (!cursorPos || !arePositionsEqual(cursorPos, gamePos)) {
            dispatch(actions.setCursorPos(gamePos));
          }
          setContextMenuPos(mousePos);
        }}
      />
      {contextMenuPos ? (
        <ContextMenu
          pos={contextMenuPos}
          onClose={() => setContextMenuPos(null)}
        />
      ) : null}
    </section>
  );
}
