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
  CANCEL_KEYS,
  CONFIRM_KEYS,
} from "~constants";
import { isDndFocused } from "~utils/controls";

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
  const isPlacing = useSelector(selectors.isPlacing);

  const moveUp = () => {
    if (!isDndFocused()) {
      dispatch(actions.move({ entityId: PLAYER_ID, ...UP }));
    }
  };
  const moveRight = () => {
    if (!isDndFocused()) {
      dispatch(actions.move({ entityId: PLAYER_ID, ...RIGHT }));
    }
  };
  const moveDown = () => {
    if (!isDndFocused()) {
      dispatch(actions.move({ entityId: PLAYER_ID, ...DOWN }));
    }
  };
  const moveLeft = () => {
    if (!isDndFocused()) {
      dispatch(actions.move({ entityId: PLAYER_ID, ...LEFT }));
    }
  };
  const movementShortcuts = Object.fromEntries<() => void>([
    ...UP_KEYS.map((key): [string, () => void] => [key, moveUp]),
    ...RIGHT_KEYS.map((key): [string, () => void] => [key, moveRight]),
    ...DOWN_KEYS.map((key): [string, () => void] => [key, moveDown]),
    ...LEFT_KEYS.map((key): [string, () => void] => [key, moveLeft]),
  ]);
  useShortcuts(movementShortcuts, !isWeaponActive && !isPlacing);

  const moveCursorUp = () => {
    if (!isDndFocused()) {
      dispatch(actions.moveCursor({ ...UP }));
    }
  };
  const moveCursorRight = () => {
    if (!isDndFocused()) {
      dispatch(actions.moveCursor({ ...RIGHT }));
    }
  };
  const moveCursorDown = () => {
    if (!isDndFocused()) {
      dispatch(actions.moveCursor({ ...DOWN }));
    }
  };
  const moveCursorLeft = () => {
    if (!isDndFocused()) {
      dispatch(actions.moveCursor({ ...LEFT }));
    }
  };
  const cursorShortcuts = Object.fromEntries<() => void>([
    ...UP_KEYS.map((key): [string, () => void] => [
      `shift + ${key}`,
      moveCursorUp,
    ]),
    ...RIGHT_KEYS.map((key): [string, () => void] => [
      `shift + ${key}`,
      moveCursorRight,
    ]),
    ...DOWN_KEYS.map((key): [string, () => void] => [
      `shift + ${key}`,
      moveCursorDown,
    ]),
    ...LEFT_KEYS.map((key): [string, () => void] => [
      `shift + ${key}`,
      moveCursorLeft,
    ]),
    ...CANCEL_KEYS.map((key): [string, () => void] => [
      key,
      () => {
        setContextMenuPos(null);
        dispatch(actions.setCursorPos(null));
      },
    ]),
    ["z", () => dispatch(actions.playerTookTurn())],
  ]);
  useShortcuts(cursorShortcuts);

  const performDefaultAction = (pos: Pos | null) => {
    if (pos) {
      if (isPlacing) {
        dispatch(actions.finishPlacement({ placeAnother: true }));
      } else {
        dispatch(actions.cycleReflector(pos));
      }
    }
  };
  const defaultActionShortcuts = Object.fromEntries<() => void>([
    ...CONFIRM_KEYS.map((key): [string, () => void] => [
      key,
      () => performDefaultAction(cursorPos),
    ]),
  ]);
  useShortcuts(defaultActionShortcuts);

  return (
    <section className="relative">
      {/* eslint-disable-next-line jsx-a11y/mouse-events-have-key-events, jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events */}
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
        onClick={(e) => {
          const mousePos = {
            x: e.nativeEvent.offsetX,
            y: e.nativeEvent.offsetY,
          };
          const gamePos = getPosFromMouse(mousePos.x, mousePos.y);
          if (!cursorPos || !arePositionsEqual(cursorPos, gamePos)) {
            dispatch(actions.setCursorPos(gamePos));
          }
          performDefaultAction(gamePos);
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
