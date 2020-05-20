/* global document */
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { app, getPosFromMouse } from "~/renderer";
import actions from "~state/actions";
import selectors from "~state/selectors";
import { arePositionsEqual } from "~utils/geometry";
import { Pos } from "~types";
import ContextMenu from "./ContextMenu";
import { useShortcuts } from "~hooks";
import {
  PLAYER_ID,
  UP,
  RIGHT,
  LEFT,
  DOWN,
  UP_KEYS,
  RIGHT_KEYS,
  LEFT_KEYS,
  DOWN_KEYS,
} from "~constants";

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
  const isWeaponActive = useSelector(selectors.isWeaponActive);

  const moveUp = () => dispatch(actions.move({ entityId: PLAYER_ID, ...UP }));
  const moveRight = () =>
    dispatch(actions.move({ entityId: PLAYER_ID, ...RIGHT }));
  const moveDown = () =>
    dispatch(actions.move({ entityId: PLAYER_ID, ...DOWN }));
  const moveLeft = () =>
    dispatch(actions.move({ entityId: PLAYER_ID, ...LEFT }));
  const movementShortcuts = Object.fromEntries<() => void>([
    ...UP_KEYS.map((key): [string, () => void] => [key, moveUp]),
    ...RIGHT_KEYS.map((key): [string, () => void] => [key, moveRight]),
    ...DOWN_KEYS.map((key): [string, () => void] => [key, moveDown]),
    ...LEFT_KEYS.map((key): [string, () => void] => [key, moveLeft]),
  ]);
  useShortcuts(movementShortcuts, !isWeaponActive);

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
